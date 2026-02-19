"use client";

import { DashboardDTO } from "@/src/types/dashboardDTO";
import AdminDashboard from "@/src/components/ui/AdminDashboard";
import CustomerDashboard from "@/src/components/ui/CustomerDashboard";
import SellerDashboard from "@/src/components/ui/SellerDashboard";
import { useState } from "react";
import Modal from "@/src/components/modal/Modal";
import { toggleMessageAfteruserActivated } from "@/src/actions/userActions";
import LabelValue from "@/src/components/ui/LabelValue";
import Button from "@/src/components/form/Button";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import WarningInfo from "@/src/components/ui/WarningInfo";

type Props = {
  dashboardStats: DashboardDTO;
}

const Dashboard = ({ dashboardStats }: Props) => {
  const shouldSeeMessage = 
  (
    dashboardStats.role === 'CUSTOMER' 
    || dashboardStats.role === 'SELLER'
  )
  && dashboardStats.messageAfterActivation;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!shouldSeeMessage);

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    try {
      await toggleMessageAfteruserActivated(dashboardStats.userId);
    } catch (error) {
      console.error("Erro ao desativar flag de mensagem:", error);
    }
  };

  const WelcomeModal = (
    <Modal 
      isOpen={isModalOpen} 
      modalTitle={'Bem-vindo(a) de volta'} 
      hasXClose
      onCloseModalActions={handleCloseModal}
    >
      <p className="text-secondary">
        Sua conta foi reativada. É bom ter você aqui novamente <span className="text-cyan">{dashboardStats.username}</span>!
      </p>
      <LabelValue
        label="Motivo"
        value={shouldSeeMessage 
          ? dashboardStats.activationJustification 
          : 'Houve um erro'
        }
      />
      <div/>
      <WarningInfo
        text="Todos seus ativos durante o tempo que você estive desativo permaneceram intocáveis."
      />
      <Button
        type={'button'}
        label="Ok"
        style={buttonColorsScheme.green}
        onClick={handleCloseModal}
      />
    </Modal>
  );

  switch (dashboardStats.role) {
    case "CUSTOMER":
      return (
        <>
          {WelcomeModal}
          <CustomerDashboard data={dashboardStats} />
        </>
      );

    case "SELLER":
      return (
        <>
          {WelcomeModal}
          <SellerDashboard data={dashboardStats} />
        </>
      );

    case "ADMIN":
      return <AdminDashboard data={dashboardStats} />;

    default:
      return null;
  }
}

export default Dashboard;