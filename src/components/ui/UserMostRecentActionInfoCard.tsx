import { AdminHistoryTag, CustomerHistoryTag, SellerHistoryTag } from "@/src/types/usersDTO";
import { formatCurrency } from "@/src/utils/formatCurrency";

type BaseProps = {
  showDivider?: boolean;
  timeStamp: string;
  product: {
    name: string;
    units: number;
    value: number;
  };
};

type CustomerProps = BaseProps & {
  userRole: 'CUSTOMER';
  action: CustomerHistoryTag;
};

type SellerProps = BaseProps & {
  userRole: 'SELLER';
  action: SellerHistoryTag;
};

type AdminProps = {
  showDivider?: boolean;
  userRole: 'ADMIN';
  action: AdminHistoryTag;
  target:
    | { type: 'USER'; username: string }
    | { type: 'PRODUCT'; productName: string };
  justification: string;
  timeStamp: string; 
};

type Props = CustomerProps | SellerProps | AdminProps;

const UserMostRecentActionInfoCard = (props:Props) => {
  switch (props.userRole) {
    case 'CUSTOMER':
    case "SELLER":
      return (
        <>
        <div className="flex flex-col text-sm mb-2 mt-1">
          <div className="flex gap-2 items-center">
            <h4 className={`text-primary ${
              props.action === 'Pedido aceito' 
              || props.action === 'Pedido negado' 
                ? 'text-base'
              : props.action === 'Pedido cancelado'
                ? 'text-[13px]'
              : 'text-lg'
            }`}>
              {props.action}
            </h4>
            <span className="text-gray">●</span>
            <span className="text-yellow text-xs">
              {props.timeStamp}
            </span>
          </div>
          <span className="text-gray">
            Produto: <span className="text-cyan">{props.product.name}</span>
          </span>
          <span className="text-gray">
            Unidades: <span className="text-primary">{props.product.units}</span>
          </span>
          <span className="text-gray">
            Valor: <span className="text-green">{formatCurrency(props.product.value)}</span>
          </span>
        </div>

        {props.showDivider && (
          <div className="border my-1 w-[95%] border-secondary-dark/30" />
        )}
        </>
      )
    case 'ADMIN': 
      return (
        <>
        <div className="flex flex-col text-sm mb-2 mt-1">
          <div className="flex gap-2 items-center">
            <h4 className='text-primary'>
              {props.action}
            </h4>
            <span className="text-gray">●</span>
            <span className="text-yellow text-xs">
              {props.timeStamp}
            </span>
          </div>
          {props.target.type === 'USER' ? (
            <span className="text-gray">
              Usuário: <span className="text-cyan">{props.target.username}</span>
            </span>
          ) : (
            <span className="text-gray">
              Produto: <span className="text-cyan">{props.target.productName}</span>
            </span>
          )}
          <span className="text-secondary">
            Justificativa: <p className="text-gray">{props.justification}</p>
          </span>
        </div>

        {props.showDivider && (
          <div className="border my-1 w-[95%] border-secondary-dark/30" />
        )}
        </>
      )
  }
}

export default UserMostRecentActionInfoCard