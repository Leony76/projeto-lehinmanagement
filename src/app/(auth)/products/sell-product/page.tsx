import PageTitle from '@/src/components/ui/PageTitle'
import AddSellProductForm from '@/src/components/form/AddSellProductForm'
import { getRequiredSession } from '@/src/lib/get-session-user'
import { redirect } from 'next/navigation';

const SellProduct = async () => {

  const user = (await getRequiredSession()).user;
  
  if (user.role !== 'SELLER') {
    redirect('/products');
  }
  
  return (
    <div>
      <PageTitle style='mt-2' title={'Vender produto'}/>
      <AddSellProductForm />
    </div>
  )
}

export default SellProduct

