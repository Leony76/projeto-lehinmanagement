import { formatCurrency } from "@/src/utils/formatCurrency";

type Props = {
  action: 'Pedido' | 'Venda' | 'Pedido negado' | 'Pedido aceito';
  timeStamp: string;
  product: {
    name: string;
    units: number;
    value: number;
  };
} 

const UserMostRecentActionInfoCard = ({
  action,
  timeStamp,
  product,
}:Props) => {
  return (
    <div className="flex flex-col text-sm mb-2 mt-1">
      <div className="flex gap-2 items-center">
        <h4 className={`text-primary ${action === 'Pedido aceito' || action === 'Pedido negado' 
          ? 'text-base'
          : 'text-lg'
        }`}>
          {action}
        </h4>
        <span className="text-gray">●</span>
        <span className="text-yellow text-xs">
          {timeStamp}
        </span>
      </div>
      <span className="text-gray">
        Produto: <span className="text-cyan">{product.name}</span>
      </span>
      <span className="text-gray">
        Unidades: <span className="text-primary">{product.units}</span>
      </span>
      <span className="text-gray">
        Valor: <span className="text-green">{formatCurrency(product.value)}</span>
      </span>
    </div>
  )
}

export default UserMostRecentActionInfoCard