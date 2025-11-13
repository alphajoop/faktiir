import { Card, CardContent } from '@/components/ui/card';
import { EmailForm } from '@/components/email-form';
import FaktiirLogo from '@/components/icons/faktiir-logo';

export default function Home() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-4 font-sans sm:p-6">
      <Card className="border-border bg-card w-full max-w-md">
        <CardContent className="space-y-6 p-8 text-center">
          <FaktiirLogo className="text-primary mx-auto h-auto w-32" />
          <p className="text-muted-foreground">
            Une nouvelle façon simple et locale de gérer vos factures arrive
            bientôt.
          </p>

          <div className="flex justify-center">
            <div className="bg-primary h-1 w-20 rounded-full"></div>
          </div>

          <p className="text-muted-foreground text-sm">
            Restez informé du lancement et soyez parmi les premiers à tester la
            version bêta.
          </p>

          <EmailForm />

          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Faktiir. Tous droits réservés.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
