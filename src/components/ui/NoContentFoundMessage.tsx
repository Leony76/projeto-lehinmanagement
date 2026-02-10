import { FaQuestion } from "react-icons/fa6"

type Props = {
  text: string | null;
}

const NoContentFoundMessage = ({text}:Props) => {
  return (
    <div className="h-[39vh] flex justify-center items-center text-center">
      <span className="text-gray flex flex-col gap-1 items-center">
        <FaQuestion size={30}/>
        {text ?? '[Não foi possível carregar!]'}
      </span>
    </div>
  )
}

export default NoContentFoundMessage