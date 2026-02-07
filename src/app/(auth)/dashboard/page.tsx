"use server";

import { titleColors } from "@/src/constants/systemColorsPallet"
import InfoCard from "@/src/components/ui/InfoCard"
import PageTitle from "@/src/components/ui/PageTitle";
import SectionTitle from "@/src/components/ui/SectionTitle";
import { ToastHandler } from "@/src/utils/showToastOnce";
import { Suspense } from "react";
import { getOverallSaleStatus, getSellerSaleStatus, getOverallSaleStatsFromSellers } from "@/src/services/sales";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAndSellersOrdersStats, getOverallCustomersAndSellersOrderStats, getSellerOrdersRevenue } from "@/src/services/orders";
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
  
  let sellerSales = null;
  let overallSales = null;
  let userRolesCount = null;
  let sellerOrdersRevenue = null;
  let customersAndSellers = null;
  let overallStatsFromSellers = null;
  let overallCustomersOrdersStats = null;
  let overallSellersOrdersStats = null;
  
  switch (user.role) {
    case 'SELLER': {
      const [ 
        sellerSaleStatusRequest,
        sellerOrdersRevenueRequest,
        customersAndSellersRequest,
      ] = await Promise.all([
        getSellerSaleStatus(user.id),
        getSellerOrdersRevenue(user.id),
        getCustomerAndSellersOrdersStats(user.id)
      ]);
            
      sellerSales = {
        orderStatus: sellerSaleStatusRequest.saleStats,
        mostRecentSale: sellerSaleStatusRequest.mostRecentSale,
        mostSoldCategory: sellerSaleStatusRequest.mostSoldCategory
      };
      
      sellerOrdersRevenue = sellerOrdersRevenueRequest;
      customersAndSellers = customersAndSellersRequest;

      break;
    } case 'ADMIN': {
      const [
        overallSaleStatusRequest,
        userRolesCountRequest,
        overallSaleRevenueFromSellersRequest,
        overallCustomersOrdersStatsRequest,
        overallSellersOrdersStatsRequest,
      ] = await Promise.all([
        getOverallSaleStatus(),
        getUsersRoleCount(),
        getOverallSaleStatsFromSellers(),
        getOverallCustomersAndSellersOrderStats('CUSTOMER'),
        getOverallCustomersAndSellersOrderStats('SELLER'),
      ]);

      userRolesCount = userRolesCountRequest;
      overallSales = overallSaleStatusRequest;
      overallStatsFromSellers = overallSaleRevenueFromSellersRequest;
      overallCustomersOrdersStats = overallCustomersOrdersStatsRequest;
      overallSellersOrdersStats = overallSellersOrdersStatsRequest;

      break;
    } default: {
      const customersAndSellersRequest = await getCustomerAndSellersOrdersStats(user.id);
      
      customersAndSellers = customersAndSellersRequest;
      break;
    } 
  }

  return (
    <>
    <Suspense fallback={null}>
      <ToastHandler/>
    </Suspense>

    <PageTitle style="py-2" title="Dashboard"/>

  {(user.role === 'SELLER') ? (
    sellerSales && sellerOrdersRevenue && customersAndSellers &&
    <>
    <SectionTitle title="Vendas"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitas"} content={sellerSales.orderStatus.total}/>
      <InfoCard title={"Pendentes"} content={sellerSales.orderStatus.status.PENDING}/>
      <InfoCard title={"Aprovadas"} content={sellerSales.orderStatus.status.APPROVED}/>
      <InfoCard title={"Rejeitadas"} content={sellerSales.orderStatus.status.REJECTED}/>

      <InfoCard title={"Faturado"} content={formatCurrency(sellerOrdersRevenue._sum.total)} style={{content: 'text-ui-money !text-base'}} />
      <InfoCard title={"Fatura média"} content={formatCurrency(sellerOrdersRevenue._avg.total)} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} />
      <InfoCard title={"Menor"} content={formatCurrency(sellerOrdersRevenue._min.total)} style={{content: 'text-ui-money !text-base'}} />
      <InfoCard title={"Maior"} content={formatCurrency(sellerOrdersRevenue._max.total)} style={{content: 'text-ui-money !text-base'}} />
      
      <InfoCard colSpanFull title={"Mais recente feita"} content={sellerSales.mostRecentSale ?? '??/??/??'}/>
      <InfoCard colSpanFull title={"Categoria mais vendida"} content={sellerSales.mostSoldCategory ?? 'Nenhuma venda aprovada no momento'}/>
    </div>
    <SectionTitle style="pb-1" title="Pedidos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitos"} content={customersAndSellers.totalOrders}/>
      <InfoCard title={"Pendentes"} content={customersAndSellers.ordersByStatus.pending}/>
      <InfoCard title={"Aceitos"} content={customersAndSellers.ordersByStatus.approved}/>
      <InfoCard title={"Negados"} content={customersAndSellers.ordersByStatus.rejected}/>
      <InfoCard colSpanFull title={"Mais recente feito"} content={customersAndSellers.mostRecentOrder}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={customersAndSellers.mostOrderedCategory}/>
    </div>
    <SectionTitle style="pb-1" title="Gastos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Totais"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.total)}/>
      <InfoCard title={"Médios"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.average)}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.min)}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.max)}/>
    </div>
    </>

  ) : (user.role === 'ADMIN' && overallSales && userRolesCount && overallStatsFromSellers && overallCustomersOrdersStats && overallSellersOrdersStats) ? (

    <>
    <SectionTitle title="Geral"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Clientes"} content={userRolesCount.customers}/>
      <InfoCard title={"Vendedores"} content={userRolesCount.sellers}/>
      <InfoCard colSpanFull title={"Administradores do sistema"} content={userRolesCount.admins}/>
    </div>
    <SectionTitle title="Vendedores"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Renda média"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={formatCurrency(overallStatsFromSellers.averageSaleRevenue)}/>
      <InfoCard title={"Vendas diárias"} style={{content: 'text-ui-money !text-base', title: 'text-[15px]'}} content={formatCurrency(overallStatsFromSellers.dailyRevenue)}/>
      <InfoCard title={"Produto mais vendido"} colSpanFull content={overallStatsFromSellers.mostSoldProductName ?? 'Nenhum produto vendido no sistema no momento'}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={overallStatsFromSellers.mostRequestedCategory ?? 'Nenhum produto pedido no sistema no momento'}/>
    </div>
    <SectionTitle title="Pedidos"/>
    <h3 className={`text-center text-2xl pb-2 ${titleColors.yellow}`}>Cliente</h3>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Feitos"} content={overallCustomersOrdersStats.totalOrders}/>
      <InfoCard title={"Pendentes"} content={overallCustomersOrdersStats.ordersStatus.PENDING}/>
      <InfoCard title={"Aprovados"} content={overallCustomersOrdersStats.ordersStatus.APPROVED}/>
      <InfoCard title={"Rejeitados"} content={overallCustomersOrdersStats.ordersStatus.REJECTED}/>
      <InfoCard title={"Gasto médio"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={formatCurrency(overallCustomersOrdersStats.averageOrderValue)}/>
      <InfoCard title={"Mais feito"} content={overallCustomersOrdersStats.mostOrderedProduct?.name ?? 'Nenhum cliente fez pedido no momento'}/>
    </div>
    <h3 className={`text-center text-2xl pb-2 ${titleColors.yellow}`}>Vendedores</h3>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Feitos"} content={overallSellersOrdersStats.totalOrders}/>
      <InfoCard title={"Pendentes"} content={overallSellersOrdersStats.ordersStatus.PENDING}/>
      <InfoCard title={"Aprovados"} content={overallSellersOrdersStats.ordersStatus.APPROVED}/>
      <InfoCard title={"Rejeitados"} content={overallSellersOrdersStats.ordersStatus.REJECTED}/>
      <InfoCard title={"Gasto médio"} style={{content: 'text-ui-money !text-base', title: 'text-[17px]'}} content={formatCurrency(overallSellersOrdersStats.averageOrderValue)}/>
      <InfoCard title={"Mais feito"} content={overallSellersOrdersStats.mostOrderedProduct?.name ?? 'Nenhum vendedor fez pedido no momento'}/>
    </div>
    </>

  ) : (
    customersAndSellers && 
    <>
    <SectionTitle title="Pedidos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4">
      <InfoCard title={"Feitos"} content={customersAndSellers.totalOrders}/>
      <InfoCard title={"Pendentes"} content={customersAndSellers.ordersByStatus.pending}/>
      <InfoCard title={"Aceitos"} content={customersAndSellers.ordersByStatus.approved}/>
      <InfoCard title={"Negados"} content={customersAndSellers.ordersByStatus.rejected}/>
      <InfoCard colSpanFull title={"Mais recente feito"} content={customersAndSellers.mostRecentOrder}/>
      <InfoCard colSpanFull title={"Categoria mais pedida"} content={customersAndSellers.mostOrderedCategory}/>
    </div>
    <SectionTitle style="pb-1" title="Gastos"/>
    <div className="grid grid-cols-2 gap-4 mx-2 my-4 mb-6">
      <InfoCard title={"Totais"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.total)}/>
      <InfoCard title={"Médios"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.average)}/>
      <InfoCard title={"Menor"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.min)}/>
      <InfoCard title={"Maior"} style={{content: 'text-ui-money !text-base'}} content={formatCurrency(customersAndSellers.spent.max)}/>
    </div>
    </>
  )}
    </>
  )
}

export default Dashboard