import { titleColors } from "@/src/constants/systemColorsPallet"
import InfoCard from "@/src/components/ui/InfoCard"
import PageTitle from "@/src/components/ui/PageTitle";
import SectionTitle from "@/src/components/ui/SectionTitle";
import prisma from "@/src/lib/prisma";

const Dashboard = async () => {

  const role = 'SELLER';

  const initialStats = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    CANCELED: 0
  };

  const orderStatus = await prisma.orderHistory.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  
  const finalStats = orderStatus.reduce((acc, curr) => {
    acc[curr.status as keyof typeof initialStats] = curr._count.status;
    return acc;
  }, { ...initialStats });

  const totalOrders = Object.values(finalStats).reduce((acc, curr) => acc + curr, 0);

  return (
    <>
    <PageTitle style="py-2" title="Dashboard"/>
  {role === 'SELLER' ? (
    <>
    <SectionTitle title="Vendas"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitas"} content={totalOrders}/>
      <InfoCard title={"Pendentes"} content={finalStats.PENDING}/>
      <InfoCard title={"Aprovadas"} content={finalStats.APPROVED}/>
      <InfoCard title={"Rejeitadas"} content={finalStats.REJECTED}/>
      <InfoCard title={"Faturado"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Fatura média"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1010,00'}/>
      <InfoCard colSpanFull title={"Mais recente feita"} content={'há 14 dias'}/>
      <InfoCard colSpanFull title={"Categoria mais vendida"} content={'Brinquedo'}/>
    </div>
    <SectionTitle style="pb-1" title="Pedidos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitos"} content={123}/>
      <InfoCard title={"Pendentes"} content={123}/>
      <InfoCard title={"Aceitos"} content={123}/>
      <InfoCard title={"Negados"} content={123}/>
      <InfoCard colSpanFull title={"Mais recente feito"} content={'há 14 dias'}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={'Brinquedo'}/>
    </div>
    <SectionTitle style="pb-1" title="Gastos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Totais"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Médios"} style={{content: 'text-ui-money !text-base'}} content={'R$ 245,00'}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={'R$ 10,00'}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1000,00'}/>
    </div>
    </>
  ) : role === 'ADMIN' ? (
    <>
    <SectionTitle title="Geral"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Clientes"} content={123}/>
      <InfoCard title={"Vendedores"} content={123}/>
      <InfoCard colSpanFull title={"Administradores do sistema"} content={1}/>
    </div>
    <SectionTitle title="Vendedores"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Renda média"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Vendas diárias"} style={{content: 'text-ui-money !text-base', title: 'text-[15px]'}} content={'R$ 245,00'}/>
      <InfoCard title={"Produto mais vendido"} colSpanFull content={'Xbox 360'}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={'Brinquedos'}/>
    </div>
    <SectionTitle title="Pedidos"/>
    <h3 className={`text-center text-2xl pb-2 ${titleColors.yellow}`}>Cliente</h3>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Feitos"} content={123}/>
      <InfoCard title={"Pendentes"} content={123}/>
      <InfoCard title={"Aprovados"} content={123}/>
      <InfoCard title={"Rejeitados"} content={123}/>
      <InfoCard title={"Gasto médio"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Mais feito"} content={'Brinquedo'}/>
    </div>
    <h3 className={`text-center text-2xl pb-2 ${titleColors.yellow}`}>Vendedores</h3>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Feitos"} content={123}/>
      <InfoCard title={"Pendentes"} content={123}/>
      <InfoCard title={"Aprovados"} content={123}/>
      <InfoCard title={"Rejeitados"} content={123}/>
      <InfoCard title={"Gasto médio"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Mais feito"} content={'Vestimenta'}/>
    </div>
    </>
  ) : (
    <>
    <SectionTitle title="Pedidos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitos"} content={123}/>
      <InfoCard title={"Pendentes"} content={123}/>
      <InfoCard title={"Aceitos"} content={123}/>
      <InfoCard title={"Negados"} content={123}/>
      <InfoCard colSpanFull title={"Mais recente feito"} content={'há 14 dias'}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={'Brinquedo'}/>
    </div>
    <SectionTitle style="pb-1" title="Gastos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Totais"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1010,00'}/>
      <InfoCard title={"Médios"} style={{content: 'text-ui-money !text-base'}} content={'R$ 245,00'}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={'R$ 10,00'}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={'R$ 1000,00'}/>
    </div>
    </>
  )}
    </>
  )
}

export default Dashboard