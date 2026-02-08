import { formatCurrency } from '@/src/utils/formatCurrency'
import React, { Suspense } from 'react'
import InfoCard from './InfoCard'
import SectionTitle from './SectionTitle'
import { ToastHandler } from '@/src/utils/showToastOnce'
import PageTitle from './PageTitle'
import { DashboardDTO } from '@/src/types/dashboardDTO'
import { timeAgo } from '@/src/utils/timeAgo'
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs'

type Props = {
  data: Extract<DashboardDTO, { role: "SELLER" }>;
};


const SellerDashboard = ({data}:Props) => {
  return (
    <>
    <Suspense fallback={null}>
      <ToastHandler/>
    </Suspense>

    <PageTitle 
      style="py-2" title="Dashboard"/>

    <SectionTitle 
      title="Vendas"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard 
        title={"Feitas"} 
        content={data.sales.done}
      />
      <InfoCard 
        title={"Pendentes"} 
        content={data.sales.pending}
      />
      <InfoCard 
        title={"Aprovadas"} 
        content={data.sales.done}
      />
      <InfoCard 
        title={"Rejeitadas"} 
        content={data.sales.unsuccessful}
      />

      <InfoCard 
        title={"Faturado"} 
        content={formatCurrency(data.sales.earn.total ?? 0)} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
      />
      <InfoCard 
        title={"Fatura média"} 
        content={formatCurrency(data.sales.earn.average ?? 0)} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base', title: 'text-[17px]'}} 
      />
      <InfoCard 
        title={"Menor"} 
        content={formatCurrency(data.sales.earn.lowest ?? 0)} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
      />
      <InfoCard 
        title={"Maior"} 
        content={formatCurrency(data.sales.earn.highest ?? 0)} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
      />
      
      <InfoCard 
        colSpanFull 
        title={"Mais recente feita"} 
        content={data.sales.mostRecentSale?.createdAt 
          ? timeAgo(data.sales.mostRecentSale?.createdAt) 
          : 'Nenhuma venda feita'
        }
      />
      <InfoCard 
        colSpanFull 
        title={"Categoria mais vendida"} 
        content={data.sales.mostSoldCategory?.[0] 
          ? CATEGORY_LABEL_MAP[data.sales.mostSoldCategory?.[0]]  
          : 'Nenhuma venda feita'
        }
      />
    </div>

    <SectionTitle 
      style="pb-1" 
      title="Pedidos"
    />

    
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard 
        title={"Feitos"} 
        content={data.orders.done}
      />
      <InfoCard 
        title={"Pendentes"} 
        content={data.orders.pending}
      />
      <InfoCard 
        title={"Aceitos"} 
        content={data.orders.approved}
      />
      <InfoCard 
        title={"Negados"} 
        content={data.orders.rejected}
      />
      <InfoCard 
        colSpanFull title={"Mais recente feito"} 
        content={data.orders.mostRecent?.createdAt ? 
          timeAgo(data.orders.mostRecent?.createdAt) 
          : 'Nenhum pedido feito'
        }
      />
      <InfoCard 
        colSpanFull title={"Categoria mais pedida"} 
        content={data.orders.mostOrderedCategory ?? 'Nenhum pedido feito'}
      />
    </div>

    <SectionTitle 
      style="pb-1" 
      title="Gastos"
    />


    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard 
        title={"Totais"} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
        content={formatCurrency(data.spend.total ?? 0)}
      />
      <InfoCard 
        title={"Médios"} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
        content={formatCurrency(data.spend.average ?? 0)}
      />
      <InfoCard 
        title={"Menor"} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
        content={formatCurrency(data.spend.lowest ?? 0)}
      />
      <InfoCard 
        title={"Maior"} 
        style={{content: 'text-ui-money dark:text-ui-money dark:brightness-[1.5] !text-base'}} 
        content={formatCurrency(data.spend.highest ?? 0)}
      />
    </div>
    </>
  )
}

export default SellerDashboard