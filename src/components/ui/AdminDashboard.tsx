import React, { Suspense } from 'react'
import SectionTitle from './SectionTitle'
import { titleColors } from '@/src/constants/systemColorsPallet'
import { formatCurrency } from '@/src/utils/formatCurrency'
import InfoCard from './InfoCard'
import { ToastHandler } from '@/src/utils/showToastOnce'
import PageTitle from './PageTitle'
import { DashboardDTO } from '@/src/types/dashboardDTO'
import { CATEGORY_LABEL_MAP } from '@/src/constants/generalConfigs'

type Props = {
  data: Extract<DashboardDTO, { role: 'ADMIN' }>;
}

const AdminDashboard = ({data}:Props) => {
  return (
    <>
    <Suspense fallback={null}>
      <ToastHandler/>
    </Suspense>

    <PageTitle 
      style="py-2"
      title="Dashboard"
    />

    <SectionTitle 
      title="Geral"
    />


    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard 
        title={"Clientes"} 
        content={data.usersCount.customers}
      />
      <InfoCard 
        title={"Vendedores"} 
        content={data.usersCount.sellers}
      />
      <InfoCard 
        colSpanFull title={"Administradores do sistema"} 
        content={data.usersCount.admins}
      />
    </div>

    <SectionTitle 
      title="Vendedores"
    />


    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard 
        title={"Renda média"} 
        style={{
          content: 'text-ui-money !text-base',
          title: 'text-[17px]'
        }} 
        content={formatCurrency(data.sellers.averageEarn)}
      />
      <InfoCard 
        title={"Vendas diárias"} 
        style={{
          content: 'text-ui-money !text-base',
          title: 'text-[15px]'
        }} 
        content={formatCurrency(data.sellers.dailyEarn)}
      />
      <InfoCard 
        title={"Produto mais vendido"} 
        colSpanFull 
        content={data.sellers.mostSoldProduct.name}
      />
      <InfoCard 
        colSpanFull title={"Categoria mais vendida"} 
        content={data.sellers.mostSoldCategory[0]
          ? CATEGORY_LABEL_MAP[data.sellers.mostSoldCategory[0]]
          : 'Nenhuma venda feita'
        }
      />
    </div>
    <SectionTitle title="Pedidos"/>

    <h3 className={`text-center text-2xl pb-2 ${titleColors.yellow}`}>
      Cliente
    </h3>


    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard 
        title={"Feitos"} 
        content={data.customers.orders.done}
      />
      <InfoCard 
        title={"Pendentes"} 
        content={data.customers.orders.pending}
      />
      <InfoCard 
        title={"Aprovados"} 
        content={data.customers.orders.approved}
      />
      <InfoCard 
        title={"Rejeitados"} 
        content={data.customers.orders.rejected}
      />
      <InfoCard 
        title={"Gasto médio"} 
        style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} 
        content={formatCurrency(data.customers.orders.averageExpediture)}
      />
      <InfoCard 
        title={"Mais feito"} 
        content={data.customers.orders.mostOrderedProduct.name}
      />
    </div>

    <h3 className={`text-center text-2xl pb-2 ${titleColors.yellow}`}>
      Vendedores
    </h3>

    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard 
        title={"Feitos"} 
        content={data.sellers.orders.done}
      />
      <InfoCard 
        title={"Pendentes"} 
        content={data.sellers.orders.pending}
      />
      <InfoCard 
        title={"Aprovados"} 
        content={data.sellers.orders.approved}
      />
      <InfoCard 
        title={"Rejeitados"} 
        content={data.sellers.orders.rejected}
      />
      <InfoCard 
        title={"Gasto médio"} 
        style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} 
        content={formatCurrency(data.sellers.orders.averageExpenditure)}
      />
      <InfoCard 
        title={"Mais feito"} 
        content={data.sellers.orders.mostOrderedProduct.name}
    />
    </div>
    </>
  )
}

export default AdminDashboard