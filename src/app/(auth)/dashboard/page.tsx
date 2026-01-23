"use server";

import { titleColors } from "@/src/constants/systemColorsPallet"
import InfoCard from "@/src/components/ui/InfoCard"
import PageTitle from "@/src/components/ui/PageTitle";
import SectionTitle from "@/src/components/ui/SectionTitle";
import { ToastHandler } from "@/src/utils/showToastOnce";
import { Suspense } from "react";
import { getOverallSaleStatus, getSellerSaleStatus } from "@/src/services/saleStatus";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerOrSellerOrdersStatus, getCustomerOrSellerSpent, getSellerOrdersRevenue } from "@/src/services/orders";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { getUsersRoleCount } from "@/src/services/users";

const Dashboard = async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  const orderStatus = await getCustomerOrSellerOrdersStatus(user.id);
  const sellerOrdersRevenue = await getSellerOrdersRevenue(user.id);
  const customerOrSellerSpent = await getCustomerOrSellerSpent(user.id);

  let sellerSales = null;
  let overallSales = null;
  let userRolesCount = null;

  switch (user.role) {
    case 'SELLER': {
      const sellerSaleStatus = await getSellerSaleStatus(user.id);
      sellerSales = sellerSaleStatus;
      break;
    } default: {
      const OAsaleStatus = await getOverallSaleStatus();
      const userRolesNumbers = await getUsersRoleCount();

      userRolesCount = userRolesNumbers;
      overallSales = OAsaleStatus;
      break;
    } 
  }

  return (
    <>
    <Suspense fallback={null}>
      <ToastHandler/>
    </Suspense>

    <PageTitle style="py-2" title="Dashboard"/>

  {(user.role === 'SELLER' && sellerSales) ? (

    <>
    <SectionTitle title="Vendas"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitas"} content={sellerSales.total}/>
      <InfoCard title={"Pendentes"} content={sellerSales.status.PENDING}/>
      <InfoCard title={"Aprovadas"} content={sellerSales.status.APPROVED}/>
      <InfoCard title={"Rejeitadas"} content={sellerSales.status.REJECTED}/>

      <InfoCard title={"Faturado"} content={formatCurrency(sellerOrdersRevenue._sum.total)} style={{content: 'text-ui-money !text-base'}} />
      <InfoCard title={"Fatura média"} content={formatCurrency(sellerOrdersRevenue._avg.total)} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} />
      <InfoCard title={"Menor"} content={formatCurrency(sellerOrdersRevenue._min.total)} style={{content: 'text-ui-money !text-base'}} />
      <InfoCard title={"Maior"} content={formatCurrency(sellerOrdersRevenue._max.total)} style={{content: 'text-ui-money !text-base'}} />
      
      <InfoCard colSpanFull title={"Mais recente feita"} content={'há 14 dias'}/>
      <InfoCard colSpanFull title={"Categoria mais vendida"} content={'Brinquedo'}/>
    </div>
    <SectionTitle style="pb-1" title="Pedidos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitos"} content={orderStatus.totalOrders}/>
      <InfoCard title={"Pendentes"} content={orderStatus.totalPendingOrders}/>
      <InfoCard title={"Aceitos"} content={orderStatus.totalApprovedOrders}/>
      <InfoCard title={"Negados"} content={orderStatus.totalDeniedOrders}/>
      <InfoCard colSpanFull title={"Mais recente feito"} content={'há 14 dias'}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={'Brinquedo'}/>
    </div>
    <SectionTitle style="pb-1" title="Gastos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Totais"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.total)}/>
      <InfoCard title={"Médios"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.average)}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.min)}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.max)}/>
    </div>
    </>

  ) : (user.role === 'ADMIN' && overallSales && userRolesCount) ? (

    <>
    <SectionTitle title="Geral"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Clientes"} content={userRolesCount.customers}/>
      <InfoCard title={"Vendedores"} content={userRolesCount.sellers}/>
      <InfoCard colSpanFull title={"Administradores do sistema"} content={userRolesCount.admins}/>
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
      <InfoCard title={"Feitos"} content={orderStatus.totalOrders}/>
      <InfoCard title={"Pendentes"} content={orderStatus.totalPendingOrders}/>
      <InfoCard title={"Aceitos"} content={orderStatus.totalApprovedOrders}/>
      <InfoCard title={"Negados"} content={orderStatus.totalDeniedOrders}/>
      <InfoCard colSpanFull title={"Mais recente feito"} content={'há 14 dias'}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={'Brinquedo'}/>
    </div>
    <SectionTitle style="pb-1" title="Gastos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Totais"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.total)}/>
      <InfoCard title={"Médios"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.average)}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.min)}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customerOrSellerSpent.max)}/>
    </div>
    </>
  )}
    </>
  )
}

export default Dashboard