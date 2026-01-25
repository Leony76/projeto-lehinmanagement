type Props = {
  children: React.ReactNode;
}

const ProductCardsGrid = ({children}:Props) => {
  return (
    <div className="
    grid 
    sm:grid-cols-1 
    md:grid-cols-2
    lg:grid-cols-3 
    xl:grid-cols-4 
    gap-5 
    my-4 
    mt-6"
    >
      {children}
    </div>
  )
}

export default ProductCardsGrid