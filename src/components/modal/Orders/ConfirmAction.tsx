import React from 'react'
import Modal from '../Modal';
import { textColors, buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { formatCurrency } from '@/src/utils/formatCurrency';
import Button from '../../form/Button';
import TextArea from '../../form/TextArea';
import Error from '../../ui/Error';

type BaseProps = {
  isOpen: boolean;
  isActionIrreversible?: boolean;
  hasWarning?: boolean;
  customSentence?: {
    title: string;
    sentence: React.ReactNode | string;
  }
  loading: boolean;
  onCloseActions: () => void;
  order?: {
    customerName: string;
    commission: number;
    amount: number;
  };
};

type AcceptProps = BaseProps & {
  decision?: 'ACCEPT';
  onAccept: {
    handleSubmit: () => Promise<void>;
  };
  onReject?: never;
};

type RejectProps = BaseProps & {
  decision?: 'REJECT' | 'REMOVE' | 'CANCEL' | 'PAY';
  onReject: {
    error?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: () => Promise<void>;
  };
  onAccept?: never;
};

type Props = AcceptProps | RejectProps;

const ConfirmAction = ({
  order,
  isOpen,
  loading,
  onReject,
  onAccept,
  decision,
  hasWarning,
  customSentence,
  isActionIrreversible,
  onCloseActions,
}:Props) => {
  return (
    <Modal 
    isOpen={isOpen} 
    modalTitle={customSentence 
      ? customSentence.title
      : 'Confirmar ação'
    }
    onCloseModalActions={onCloseActions}
    >
      {customSentence ? (
        <p className={`${textColors.secondaryMiddleDark}`}>
          {customSentence.sentence}
        </p>
      ) : (
        <p className={`${textColors.secondaryMiddleDark}`}>
          Tem certeza que {decision === 'ACCEPT' 
            ? 'aceitar' 
            : 'rejeitar'
          } o pedido do cliente <span className='text-cyan'>{order?.customerName}</span> de <span className='text-ui-stock'>{order?.amount}</span> {order?.amount ?? 1 > 1 
            ? 'unidades' 
            : 'unidade'
          } desse produto pela comissão de <span className='text-ui-money dark:brightness-[1.3]'>{formatCurrency(order?.commission ?? 0)}</span> ?
        </p>
      )}
      {(decision === 'REJECT') ? (
        <>
        <TextArea 
          style={{input: `mb-[-2px] h-30 ${
            onReject?.error 
              ? 'shadow-[0px_0px_5px_red]' 
              : ''
          }`}}
          maxLength={1000}
          placeholder={'Justificativa'}
          label='Justificativa da rejeição'
          onChange={onReject?.onChange}
        />
        {onReject?.error && <Error error={onReject.error}/>}
        {hasWarning && (
          <span className='text-yellow-dark'>
            (!) Essa ação pode ser revertida depois
          </span>
        )}
        </>
      ) : (decision === 'CANCEL') ? (
        <>
        <span className='text-secondary-middledark text-sm'>
          Caso tenha já tenha efetuado o pagamento, será notificado ao vendedor que você cancelou o pedido e será estornado seu dinheiro.
        </span>
        <span className='text-yellow-dark'>
          {hasWarning && isActionIrreversible 
            ? '(!) Essa ação é irreversível'
            : '(!) Essa ação pode ser revertida depois'        
          }
        </span>
        </>
      ) : (  
        <span className='text-yellow-dark'>
          {hasWarning && isActionIrreversible 
            ? '(!) Essa ação é irreversível'
            : '(!) Essa ação pode ser revertida depois'        
          }
        </span>
      )}
      <div className='flex gap-2'>
        <Button 
          type='button'
          style={`px-5 flex-1 text-xl ${buttonColorsScheme.green}`} 
          label='Sim'
          onClick={decision === 'ACCEPT' 
            ? onAccept?.handleSubmit
            : onReject?.handleSubmit
          }
          loading={loading}
          loadingLabel='Processando'
          spinnerColor='text-green'
        />
        <Button 
          type='button'
          style={`px-5 flex-1 text-xl ${buttonColorsScheme.red}`} 
          label='Não'
          onClick={onCloseActions}
        />
      </div>
    </Modal>
  )
}

export default ConfirmAction