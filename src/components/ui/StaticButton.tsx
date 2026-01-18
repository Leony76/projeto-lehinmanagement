type Props = {
  style: string;
  value: string;
}

const StaticButton = ({style, value}:Props) => {
  return (
    <div className={`py-1 px-3 rounded-3xl text-center border ${style ?? ''}`}>{value}</div>
  )
}

export default StaticButton