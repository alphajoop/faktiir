'use client';

import {
  LandingSection,
  LandingSectionHeader,
} from '@/components/landing/landing-section';
import { Reveal } from '@/components/landing/reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'Faktiir est-il vraiment gratuit ?',
    answer:
      'Oui. Faktiir est open source et gratuit, sans frais cachés. Vous pouvez créer un compte et facturer sans limite de clients ni de factures.',
  },
  {
    question: 'Pour qui est-ce fait ?',
    answer:
      'Pour les freelances et petites entreprises d’Afrique francophone qui veulent facturer simplement, sans outil lourd ni abonnement obligatoire.',
  },
  {
    question: 'Puis-je exporter mes factures en PDF ?',
    answer:
      'Oui. Chaque facture peut être téléchargée en PDF avec votre logo et vos coordonnées, prête à envoyer à vos clients.',
  },
  {
    question: 'Les relances automatiques, comment ça marche ?',
    answer:
      'Faktiir détecte chaque jour les factures en retard et envoie automatiquement un e-mail de relance à vos clients. Vous n’avez rien à faire manuellement.',
  },
  {
    question: 'Mes données sont-elles en sécurité ?',
    answer:
      'Oui. Vos données sont isolées par compte, l’authentification utilise une session sécurisée (cookie httpOnly), et le code est open source — auditable et auto-hébergeable.',
  },
  {
    question: 'Puis-je auto-héberger Faktiir ?',
    answer:
      'Oui. Le dépôt GitHub est public (licence MIT). Vous pouvez déployer Faktiir sur votre propre infrastructure si vous le souhaitez.',
  },
  {
    question: 'Faut-il une carte bancaire pour s’inscrire ?',
    answer:
      'Non. Aucune carte bancaire n’est requise. Créez un compte et commencez immédiatement.',
  },
  {
    question: 'Comment contribuer au projet open source ?',
    answer:
      'Les contributions sont bienvenues sur GitHub : issues, pull requests ou suggestions. Le code source est entièrement public.',
  },
] as const;

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export function FaqSection() {
  return (
    <LandingSection id="faq" variant="muted" size="narrow">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Reveal>
        <LandingSectionHeader
          eyebrow="FAQ"
          title="Questions fréquentes"
          description="Les réponses aux questions les plus posées avant de démarrer."
        />
      </Reveal>

      <Reveal>
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="font-heading text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </LandingSection>
  );
}
