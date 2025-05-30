import LoginForm from '@/components/LoginForm';
import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/getUser';

export default async function LoginPage() {
  const user = await getUserFromCookie();
  if (user) {
    redirect("/");
  }

  return (
   <LoginForm />

  );
}
