import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedClients() {
  console.log("Seeding 10 clients...");

  const clients = [
    {
      name: "Sonatel Solutions",
      email: "moussa.ndiaye@gmail.com",
      address: "Boulevard de la Libération, Dakar, Sénégal",
      phone: "+221 33 123 45 67",
    },
    {
      name: "Touba Digital",
      email: "fatou.fall@outlook.com",
      address: "Plateau, Dakar, Sénégal",
      phone: "+221 33 234 56 78",
    },
    {
      name: "Sahel Tech Group",
      email: "ibrahima.sow@yahoo.com",
      address: "Almadies, Dakar, Sénégal",
      phone: "+221 33 345 67 89",
    },
    {
      name: "Baobab Innovation",
      email: "aida.ba@company.com",
      address: "Mermoz, Dakar, Sénégal",
      phone: "+221 33 456 78 90",
    },
    {
      name: "Goree Island Tech",
      email: "cheikh.diop@techcorp.sn",
      address: "Gorée, Dakar, Sénégal",
      phone: "+221 33 567 89 01",
    },
    {
      name: "Teranga Services",
      email: "marie.sarr@digital.sn",
      address: "Ouakam, Dakar, Sénégal",
      phone: "+221 33 678 90 12",
    },
    {
      name: "Senegal Business Hub",
      email: "babacar.kane@webdev.sn",
      address: "Sacré-Coeur, Dakar, Sénégal",
      phone: "+221 33 789 01 23",
    },
    {
      name: "Dakar Finance Plus",
      email: "adama.ly@gmail.com",
      address: "Point E, Dakar, Sénégal",
      phone: "+221 33 890 12 34",
    },
    {
      name: "Legal Consult Sénégal",
      email: "ousmane.seck@outlook.com",
      address: "HLM Grand Dakar, Sénégal",
      phone: "+221 33 901 23 45",
    },
    {
      name: "Santé Tech Afrique",
      email: "khady.dieng@yahoo.com",
      address: "Pikine, Sénégal",
      phone: "+221 33 012 34 56",
    },
  ];

  for (const client of clients) {
    await prisma.client.create({
      data: {
        ...client,
        userId: "69da40db685408127fb11d09",
      },
    });
  }

  console.log("10 clients created successfully!");
}

// Exécuter si appelé directement
if (require.main === module) {
  seedClients()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
