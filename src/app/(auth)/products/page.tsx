import Input from "@/src/components/form/Input";
import PageTitle from "@/src/components/ui/PageTitle";
import Select from "@/src/components/form/Select";
import Search from "@/src/components/form/Search";
import Image from "next/image";
import Placeholder from '@/public/my-interpretation-of-the-torque-twister-before-picture-on-v0-2p6oyytw55691.jpg';
import { IoStar } from "react-icons/io5";
import Button from "@/src/components/form/Button";

const Products = () => {
  return (
    <div>
      <PageTitle style="my-2" title="Produtos"/>
      <div>
        <Search style={{input: 'mt-5'}} colorScheme="primary"/>
        <div className="flex gap-3 mt-3">
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"FILTER"} colorScheme={"primary"} label={"Filtro"}/>
          <Select style={{input: 'flex-1 w-full'}} selectSetup={"CATEGORY"} colorScheme={"primary"} label={"Categoria"}/>
        </div>
      </div>
      <div className="grid grid-cols-1 my-4 mt-6">
        <div className="rounded-xl shadow-[0px_0px_3px_gray] p-2">
          <Image 
            src={Placeholder} 
            alt={'placeholder'}
            className="rounded-xl"
          />
          <div className="flex flex-col gap-1 mt-2">
            <h3 className="text-primary-middledark text-2xl">Torque Twister</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-secondary-dark">
                <span>Brinquedo</span>
                <span className="text-[10px] text-gray-400">●</span>
                <span>14/01/26</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-dark">
                <IoStar/>
                3,5
              </div>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-ui-money text-xl">R$ 100,00</span>
              <span className="text-ui-stock text-lg">Em estoque: 123</span>
            </div>
            <Button label={"Fazer pedido"} colorScheme={'primary'}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products