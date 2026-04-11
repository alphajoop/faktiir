import {
  LayoutDashboardIcon,
  PanelLeftIcon,
  PlusIcon,
  ReceiptIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';
import FaktiirIcon from '@/components/icons/faktiir-icon';

// Données des factures pour le preview
const INVOICES = [
  {
    number: 'FAK-0012',
    client: 'Diop & Associés',
    date: '2 avr. 2026',
    dueDate: '16 avr. 2026',
    amount: '450 000',
    badge: 'Payée',
    badgeColor: 'bg-green-500/15 text-green-700 dark:text-green-400',
  },
  {
    number: 'FAK-0011',
    client: 'Orange Sénégal',
    date: '28 mar. 2026',
    dueDate: '11 avr. 2026',
    amount: '1 200 000',
    badge: 'Envoyée',
    badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  },
  {
    number: 'FAK-0010',
    client: 'SGBS',
    date: '15 mar. 2026',
    dueDate: '29 mar. 2026',
    amount: '320 000',
    badge: 'En retard',
    badgeColor: 'bg-red-500/15 text-red-700 dark:text-red-400',
  },
  {
    number: 'FAK-0009',
    client: 'xarala',
    date: '3 mar. 2026',
    dueDate: '17 mar. 2026',
    amount: '780 000',
    badge: 'Brouillon',
    badgeColor: 'bg-muted text-muted-foreground',
  },
];

// Navigation pour le preview
const NAV = [
  { icon: LayoutDashboardIcon, label: 'Tableau de bord', active: false },
  { icon: ReceiptIcon, label: 'Factures', active: true },
  { icon: UsersIcon, label: 'Clients', active: false },
];

export function AppPreview() {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Glow effect */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-3xl bg-primary/15 blur-3xl opacity-70"
      />

      {/* Outer frame - browser chrome */}
      <div className="relative rounded-2xl border border-border/80 bg-card shadow-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400/80" />
            <div className="size-2.5 rounded-full bg-yellow-400/80" />
            <div className="size-2.5 rounded-full bg-green-400/80" />
          </div>
          {/* URL bar */}
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-background/80 border border-border/60 px-2.5 py-1 max-w-[200px]">
            <div className="size-2 rounded-full bg-green-500/70 shrink-0" />
            <span className="text-[10px] text-muted-foreground/70 font-mono truncate">
              faktiir.com/dashboard
            </span>
          </div>
        </div>

        {/* Dashboard layout - exact replica */}
        <div className="flex h-[340px] sm:h-[380px] bg-background">
          {/* Sidebar */}
          <div className="hidden w-[168px] shrink-0 border-r border-sidebar-border bg-sidebar sm:flex flex-col">
            {/* Sidebar header */}
            <div className="flex items-center gap-2 p-3 border-b border-sidebar-border/50">
              <div className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary">
                <FaktiirIcon className="size-3.5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xs font-semibold text-sidebar-foreground tracking-tight">
                FAKTIIR
              </span>
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-0.5 p-2 flex-1">
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition-colors ${
                    item.active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/55 hover:bg-sidebar-accent/50'
                  }`}
                >
                  <item.icon className="size-3 shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Sidebar footer */}
            <div className="border-t border-sidebar-border/50 p-2">
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-sidebar-foreground/55">
                <SettingsIcon className="size-3 shrink-0" />
                <span>Paramètres</span>
              </div>
              {/* User row */}
              <div className="flex items-center gap-2 px-2 py-1.5 mt-1">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[8px] font-semibold text-primary">
                  AD
                </div>
                <div className="min-w-0 text-start">
                  <div className="text-[10px] font-medium text-sidebar-foreground truncate">
                    Alpha Diop
                  </div>
                  <div className="text-[9px] text-sidebar-foreground/50 truncate">
                    alpha.diop@outlook.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Page header - exact replica of PageHeader component */}
            <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-background px-3">
              <div className="flex size-6 items-center justify-center rounded-md hover:bg-muted">
                <PanelLeftIcon className="size-3.5 text-muted-foreground" />
              </div>
              <div className="h-3.5 w-px bg-border" />
              <span className="text-xs font-semibold text-foreground font-heading truncate">
                Factures
              </span>
              <div className="ml-auto flex items-center">
                <div className="flex items-center gap-1 rounded-md bg-primary px-2 py-1">
                  <PlusIcon className="size-2.5 text-primary-foreground" />
                  <span className="text-[10px] font-medium text-primary-foreground">
                    Nouvelle facture
                  </span>
                </div>
              </div>
            </header>

            {/* Content area */}
            <div className="flex-1 overflow-hidden p-3 flex flex-col gap-2.5">
              {/* Stat cards row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Chiffre d'affaires",
                    value: '1 950 000',
                    icon: TrendingUpIcon,
                    sub: '1 facture payée',
                  },
                  {
                    label: 'En attente',
                    value: '2',
                    icon: ReceiptIcon,
                    sub: 'à traiter',
                  },
                  {
                    label: 'Clients',
                    value: '8',
                    icon: UsersIcon,
                    sub: 'actifs',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border bg-card p-2 flex flex-col gap-1.5 text-start"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] max-sm:text-[7px] text-muted-foreground">
                        {stat.label}
                      </span>
                      <div className="flex size-3.5 sm:size-3 items-center justify-center rounded bg-muted">
                        <stat.icon className="size-2 sm:size-1.5 text-muted-foreground" />
                      </div>
                    </div>
                    <span className="text-xs sm:text-[9px] font-semibold text-foreground tabular-nums leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[9px] max-sm:text-[7px] text-muted-foreground">
                      {stat.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Invoices table */}
              <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden flex flex-col text-start">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_80px_80px_56px_64px] gap-2 border-b border-border px-3 py-1.5 bg-muted/30">
                  {[
                    'Numéro',
                    'Client',
                    'Date',
                    'Échéance',
                    'Statut',
                    'Montant',
                  ].map((h) => (
                    <span
                      key={h}
                      className="text-[9px] max-sm:text-[7px] font-medium text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                <div className="flex flex-col divide-y divide-border flex-1">
                  {INVOICES.map((inv) => (
                    <div
                      key={inv.number}
                      className="grid grid-cols-[1fr_1fr_80px_80px_56px_64px] gap-2 items-center px-3 py-1.5 hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-[10px] max-sm:text-[7px] font-medium text-foreground tabular-nums truncate">
                        {inv.number}
                      </span>
                      <span className="text-[10px] max-sm:text-[7px] text-muted-foreground truncate">
                        {inv.client}
                      </span>
                      <span className="text-[10px] max-sm:text-[7px] text-muted-foreground truncate">
                        {inv.date}
                      </span>
                      <span className="text-[10px] max-sm:text-[7px] text-muted-foreground truncate">
                        {inv.dueDate}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[8px] max-sm:text-[6px] font-medium ${inv.badgeColor}`}
                      >
                        {inv.badge}
                      </span>
                      <span className="text-[10px] max-sm:text-[7px] font-medium text-foreground tabular-nums truncate">
                        {inv.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
