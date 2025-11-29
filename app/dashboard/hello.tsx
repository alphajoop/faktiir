import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SignOutButton } from '@/components/sign-out-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const { user } = session;
  const memberSince = user.createdAt ? user.createdAt : new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Welcome back, {user.name}!</CardDescription>
            </div>
            <SignOutButton />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Profile Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.address && (
                <div>
                  <p className="text-muted-foreground text-sm">Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              )}
              {user.phone && (
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-sm">Member Since</p>
                <p className="font-medium">
                  {format(memberSince, 'MMMM yyyy')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
