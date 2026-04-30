# Rappels automatiques de factures en retard

> **Ajouté dans** : `apps/api/src/scheduler/`  
> **Dépendance** : `@nestjs/schedule`, Resend (déjà configuré)

---

## Fonctionnement

Chaque jour à **08h00**, un cron job vérifie les factures dont le statut est `SENT`
et dont la date d'échéance est dépassée. Il effectue deux actions :

1. **Mise à jour du statut** — les factures concernées passent automatiquement de `SENT` à `OVERDUE`.
2. **Envoi d'un email** — si le client possède une adresse email, un rappel de paiement lui est envoyé.

Le job est **idempotent** : une facture déjà en `OVERDUE` n'est jamais retraitée,
il n'y a donc aucun risque d'envoyer un email en double lors d'une réexécution.

---

## Architecture

```
apps/api/src/
├── scheduler/
│   ├── scheduler.module.ts   # Importe MailModule, déclare SchedulerService
│   └── scheduler.service.ts  # @Cron — logique principale
└── mail/
    └── mail.service.ts       # + sendOverdueInvoiceReminder()
```

`app.module.ts` enregistre `ScheduleModule.forRoot()` et `SchedulerModule`.

---

## Installation

```bash
cd apps/api
bun add @nestjs/schedule
```

Aucune variable d'environnement supplémentaire n'est requise.  
Le service Resend utilise `RESEND_API_KEY` et `RESEND_FROM` déjà présents.

---

## Configuration

Le cron tourne à `08:00` tous les jours (`EVERY_DAY_AT_8AM`).  
Pour modifier la fréquence, changez le décorateur dans `scheduler.service.ts` :

```ts
// Toutes les heures (pratique en staging)
@Cron(CronExpression.EVERY_HOUR)

// Heure personnalisée — ex: 09h30
@Cron('30 9 * * *')
```

---

## Email envoyé au client

L'email reprend le design des autres emails transactionnels de Faktiir :

| Champ   | Valeur |
|---------|--------|
| **De**  | Nom de l'entreprise du prestataire (`companyName` ou `name`) |
| **À**   | Email du client (ignoré si absent) |
| **Objet** | `Rappel : facture FAK-XXXX en attente de règlement` |
| **Corps** | Numéro de facture, montant dû en XOF, date d'échéance |

Si `client.email` est `null`, le traitement continue sans erreur pour les autres factures du lot.

---

## Comportement en cas d'erreur

Les envois d'emails se font en parallèle via `Promise.allSettled`.  
Un échec Resend (timeout, quota, etc.) est logué mais n'interrompt pas le reste du lot.  
La mise à jour des statuts en base est toujours effectuée, même si tous les emails échouent.

---

## Tests

```bash
cd apps/api
bun test src/scheduler/scheduler.service.test.ts
```

Les 6 cas couverts :

| Cas | Description |
|-----|-------------|
| ✅ Happy path | Statut mis à jour + email envoyé |
| ✅ Pas d'email client | Statut mis à jour, email ignoré |
| ✅ Aucune facture en retard | Aucune action |
| ✅ Batch multiple | 3 factures traitées, 2 emails envoyés |
| ✅ Échec partiel Resend | Le lot continue malgré l'erreur |
| ✅ `companyName` null | Repli sur `user.name` |

---

## Contribuer

Les contributions sont les bienvenues. Quelques pistes d'amélioration :

- **Délai de grâce** — n'envoyer le rappel qu'après N jours de retard.
- **Limite d'envois** — éviter de ré-envoyer si un rappel a déjà été envoyé cette semaine.
- **Rappel au prestataire** — notifier également le propriétaire du compte des factures en retard.
- **Template multilingue** — détecter la langue préférée du client.

Pour toute question, ouvrez une issue sur [GitHub](https://github.com/alphajoop/faktiir).
