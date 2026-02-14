import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import React from 'react'
import Button from '../../form/Button';
import TextArea from '../../form/TextArea';
import WarningInfo from '../../ui/WarningInfo';
import Modal from '../Modal';
import { UsersDTO } from '@/src/types/usersDTO';
import { UsersPageModals } from '@/src/types/modal';
import Error from '../../ui/Error';

type Props = {
  user: UsersDTO;
  modal: {
    setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
    activeModal: UsersPageModals | null;
    onCloseActions: () => void;
  };
  handles: {
    handleDeactivateUserAccount: () => Promise<void>;
    handleActivateUserAccount: () => Promise<void>;
  };
  onChange: {
    setAccountActivationJustify: React.Dispatch<React.SetStateAction<string>>; 
    setAccountDeactivationJustify: React.Dispatch<React.SetStateAction<string>>; 
  };
  textArea: {
    accountDeactivationJustify: string;
    accountActivationJustify: string;
  };
  misc: { 
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
  };
}

const ActiveDeactiveUserAccount = ({
  modal,
  user,
  handles,
  onChange,
  textArea,
  misc,
}: Props) => {
  const isActivating = modal.activeModal === 'ACTIVATE_USER';
  
  const currentJustify = isActivating 
    ? textArea.accountActivationJustify 
    : textArea.accountDeactivationJustify;
  
  const setJustify = isActivating ? onChange.setAccountActivationJustify : onChange.setAccountDeactivationJustify;

  const handleAction = () => {
    if (currentJustify.length === 0) {
      misc.setError(`Não é possível ${isActivating ? 'ativar' : 'desativar'} a conta sem uma justificativa.`);
      return;
    } if (currentJustify.length < 100) {
      misc.setError('A justificativa deve conter ao menos 100 caracteres.');
      return;
    } if (isActivating) {
      handles.handleActivateUserAccount();
    } else {
      handles.handleDeactivateUserAccount();
    }
  };

  return (
    <Modal 
      isOpen={modal.activeModal === 'ACTIVATE_USER' || modal.activeModal === 'DEACTIVATE_USER'} 
      hasXClose
      modalTitle={isActivating ? 'Ativar usuário' : 'Desativar usuário'} 
      onCloseModalActions={modal.onCloseActions}
    >
      <p className="text-secondary-middledark">
        Tem certeza que deseja {isActivating ? 'ativar' : 'desativar'} <span className="text-cyan">{user.name}</span> do sistema?
      </p>
      
      <p className="text-primary mt-2">
        Cite a justificativa da {isActivating ? 'ativação' : 'desativação'}
      </p>

      <TextArea
        maxLength={500}
        placeholder="Justificativa"
        value={currentJustify}
        style={{
          input: `${misc.error ? 'shadow-[0px_0px_7px_red]' : ''} h-30`,
          container: 'mb-[-7px]'
        }}
        onChange={(e) => {
          setJustify(e.target.value);
          if (e.target.value.length >= 100) misc.setError('');
        }}
      />

      {misc.error && <Error error={misc.error}/>}

      {!isActivating && (
        <div className="mt-4">
          <WarningInfo 
            text="Todos os ativos do usuário desativado permanecerão intocáveis. O mesmo também será informado."
          />
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <Button 
          style={`flex-1 ${isActivating 
            ? buttonColorsScheme.green 
            : buttonColorsScheme.red
          }`}
          type="button"
          loading={misc.loading}
          loadingLabel="Processando"
          label={isActivating ? 'Ativar' : 'Desativar'}
          onClick={handleAction} 
        />
        <Button 
          style={`flex-1  ${isActivating 
            ? buttonColorsScheme.red 
            : buttonColorsScheme.yellow
          }`}
          type="button"
          label="Cancelar"
          onClick={() => {
            modal.setActiveModal('USER_INFOS');
            misc.setError('');
            setJustify('');
          }}
        />
      </div>
    </Modal>
  )
}

export default ActiveDeactiveUserAccount;