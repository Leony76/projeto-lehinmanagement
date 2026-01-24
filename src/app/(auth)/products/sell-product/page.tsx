import PageTitle from '@/src/components/ui/PageTitle'
import { auth } from '@/src/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AddSellProductForm from '@/src/components/form/AddSellProductForm'

const SellProduct = async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div>
      <PageTitle style='mt-2' title={user.role === 'ADMIN'
        ? 'Adicionar produto'
        : 'Vender produto'
      }/>
      <AddSellProductForm />
    </div>
  )
}

export default SellProduct

