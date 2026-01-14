import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/authServer';
import AuthLanding from '@/app/ui/AuthLanding';

const HomePage = async () => {
  const auth = await getAuthFromCookies();
  if (auth) {
    redirect('/tasks');
  }

  return <AuthLanding />;
};

export default HomePage;
