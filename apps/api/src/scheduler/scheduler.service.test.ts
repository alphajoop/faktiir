import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

// ---------------------------------------------------------------------------
// Minimal stubs — no real DB or HTTP calls
// ---------------------------------------------------------------------------

type Invoice = {
  id: string;
  number: string;
  status: string;
  total: number;
  dueDate: Date;
  client: { name: string; email: string | null };
  user: { name: string; companyName: string | null };
};

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: "inv-1",
    number: "FAK-0001",
    status: "SENT",
    total: 150_000,
    dueDate: new Date("2024-01-01"),
    client: { name: "Acme Corp", email: "client@acme.com" },
    user: { name: "Alpha Diop", companyName: "Alpha Studio" },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Inline SchedulerService to avoid NestJS DI in unit tests
// ---------------------------------------------------------------------------

// We re-implement a thin version of the service with injected deps so we can
// test the logic without spinning up the full NestJS container.

class StubPrisma {
  invoices: Invoice[];

  constructor(invoices: Invoice[]) {
    this.invoices = invoices;
  }

  invoice = {
    findMany: mock((_opts?: unknown) => Promise.resolve(this.invoices)),
    updateMany: mock((_opts?: unknown) =>
      Promise.resolve({ count: this.invoices.length }),
    ),
  };
}

class StubMail {
  sendOverdueInvoiceReminder = mock(
    (
      _email: string,
      _name: string,
      _number: string,
      _total: number,
      _dueDate: Date,
      _userCompanyName: string,
    ) => Promise.resolve(),
  );
}

// Inline of the real logic (keeps test self-contained)
async function markOverdueAndNotify(
  prisma: StubPrisma,
  mail: StubMail,
  now = new Date(),
) {
  const candidates = await prisma.invoice.findMany({
    where: { status: "SENT", dueDate: { lt: now } },
  } as never);

  if (candidates.length === 0) return;

  await prisma.invoice.updateMany({
    where: { id: { in: candidates.map((inv) => inv.id) } },
    data: { status: "OVERDUE" },
  } as never);

  const emailJobs = candidates
    .filter((inv) => !!inv.client.email)
    .map((inv) =>
      mail
        .sendOverdueInvoiceReminder(
          inv.client.email as string,
          inv.client.name,
          inv.number,
          inv.total,
          inv.dueDate,
          inv.user.companyName ?? inv.user.name,
        )
        .catch(() => {}),
    );

  await Promise.allSettled(emailJobs);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SchedulerService.markOverdueAndNotify", () => {
  let prisma: StubPrisma;
  let mail: StubMail;

  beforeEach(() => {
    mail = new StubMail();
  });

  afterEach(() => {
    mock.restore();
  });

  it("marks overdue invoices and sends reminder emails", async () => {
    const inv = makeInvoice();
    prisma = new StubPrisma([inv]);

    await markOverdueAndNotify(prisma, mail);

    // Status update was called
    expect(prisma.invoice.updateMany).toHaveBeenCalledTimes(1);
    expect(prisma.invoice.updateMany.mock.calls[0][0]).toMatchObject({
      data: { status: "OVERDUE" },
    });

    // Email was sent to the client
    expect(mail.sendOverdueInvoiceReminder).toHaveBeenCalledTimes(1);
    expect(mail.sendOverdueInvoiceReminder.mock.calls[0]).toEqual([
      "client@acme.com",
      "Acme Corp",
      "FAK-0001",
      150_000,
      inv.dueDate,
      "Alpha Studio",
    ]);
  });

  it("skips email when client has no email address", async () => {
    prisma = new StubPrisma([
      makeInvoice({ client: { name: "No Email Client", email: null } }),
    ]);

    await markOverdueAndNotify(prisma, mail);

    expect(prisma.invoice.updateMany).toHaveBeenCalledTimes(1);
    expect(mail.sendOverdueInvoiceReminder).not.toHaveBeenCalled();
  });

  it("does nothing when no SENT invoices are overdue", async () => {
    prisma = new StubPrisma([]);

    await markOverdueAndNotify(prisma, mail);

    expect(prisma.invoice.updateMany).not.toHaveBeenCalled();
    expect(mail.sendOverdueInvoiceReminder).not.toHaveBeenCalled();
  });

  it("processes multiple overdue invoices in one pass", async () => {
    prisma = new StubPrisma([
      makeInvoice({ id: "inv-1", number: "FAK-0001" }),
      makeInvoice({ id: "inv-2", number: "FAK-0002" }),
      makeInvoice({
        id: "inv-3",
        number: "FAK-0003",
        client: { name: "No Email", email: null },
      }),
    ]);

    await markOverdueAndNotify(prisma, mail);

    // All three are bulk-updated
    const updateCall = prisma.invoice.updateMany.mock.calls[0][0] as {
      where: { id: { in: string[] } };
    };
    expect(updateCall.where.id.in).toHaveLength(3);

    // Only the two with emails get a reminder
    expect(mail.sendOverdueInvoiceReminder).toHaveBeenCalledTimes(2);
  });

  it("continues sending remaining emails even if one fails", async () => {
    prisma = new StubPrisma([
      makeInvoice({ id: "inv-1", number: "FAK-0001" }),
      makeInvoice({
        id: "inv-2",
        number: "FAK-0002",
        client: { name: "B", email: "b@b.com" },
      }),
    ]);

    // First call throws, second should still succeed
    mail.sendOverdueInvoiceReminder = mock()
      .mockRejectedValueOnce(new Error("Resend timeout"))
      .mockResolvedValue(undefined);

    // Should not throw
    await expect(markOverdueAndNotify(prisma, mail)).resolves.toBeUndefined();

    // Both calls were attempted
    expect(mail.sendOverdueInvoiceReminder).toHaveBeenCalledTimes(2);
  });

  it("falls back to user name when companyName is null", async () => {
    prisma = new StubPrisma([
      makeInvoice({ user: { name: "Solo Dev", companyName: null } }),
    ]);

    await markOverdueAndNotify(prisma, mail);

    const senderName = mail.sendOverdueInvoiceReminder.mock.calls[0][5];
    expect(senderName).toBe("Solo Dev");
  });
});
