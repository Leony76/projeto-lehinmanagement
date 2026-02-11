"use client";

import Image from 'next/image'
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Button from '../form/Button';
import { UserProductOrdersFilterValue } from '@/src/constants/generalConfigs';
import { AiOutlineMessage } from 'react-icons/ai';
import { buttonColorsScheme } from '@/src/constants/systemColorsPallet';
import { UserProductDTO } from '@/src/types/userProductDTO';
import Rating from '../ui/Rating';
import { FaRegTrashCan } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import UserProductMenu from '../modal/Orders/UserProductMenu';
import { productCardStyles as style } from '@/src/styles/Product/productCard.style';
import ImageExpand from '../modal/ImageExpand';
import RemoveUserProduct from '../modal/Orders/RemoveUserProduct';
import ProductComment from '../modal/Product/ProductComment';
import { useUserProductLogic } from '@/src/hooks/pageLogic/useUserProductLogic';

type Props = {
  userProduct: UserProductDTO;
}

const MyProduct = ({
  userProduct,
}:Props) => {

  const {
    error,
    rating,
    loading,
    category,
    activeModal,
    orderSearch,
    orderFilter,
    datePutToSale,
    productComment,
    handleCommentRatingProduct,
    handleRemoveUserProduct,
    setProductComment,
    setOrderSearch,
    setActiveModal,
    setOrderFilter,
    setLoading,
    setRating,
    setError,
  } = useUserProductLogic({ userProduct });

  return (
    <motion.div
      layout 
      initial={{ opacity: 1, scale: 1 }}
      className={style.mainContentContainer}
      exit={{ 
        opacity: 0, 
        scale: 2, 
        filter: "blur(10px)",
        transition: { duration: 0.25 } 
      }}
    >
      <div className={style.imageContainer}>
        <Image 
          src={userProduct.imageUrl} 
          alt={userProduct.name}
          fill
          className={style.image}
        />
      </div>
      <div className={style.productInfosContainer}>
        <h3 className={style.name}>{userProduct.name}</h3>
        <div className={style.category_date_ratingContainer}>
          <div className={style.category_date}>
            <span>{category}</span>
            <span className="text-[10px] text-gray-400">●</span>
            <span>{datePutToSale}</span>
          </div>
          <div className={style.rating}>
            {!userProduct.productAverageRating 
              ? <IoStarOutline/>
              : <IoStar/> 
            }
            {userProduct.productAverageRating ?? 'Não avaliado'}
          </div>
        </div>
        <div className={style.rating_commentContainer}>
          <Rating 
            value={rating}
            onChange={setRating}
          />
          <div className={rating !== 0 
            ? style.rate.rated 
            : style.rate.notRated
          }>
            <Button
              type="button"
              onClick={() => setActiveModal('COMMENT')}
              icon={AiOutlineMessage}
              style={`px-5 text-2xl ${buttonColorsScheme.yellow}`}
            />
          </div>
        </div>
        <div className='flex mt-2 gap-2'>
          <Button 
            type='button' 
            style={style.moreInfosButton} 
            label={"Mais Informações"} 
            onClick={() => setActiveModal('USER_PRODUCT_INFO')}
          />
          <Button 
            style={style.removeProductButton}
            type={'submit'}            
            icon={FaRegTrashCan}
            onClick={() => setActiveModal('REMOVE_PRODUCT_CONFIRM')}
          />
        </div>
      </div>

    {/* ⇊ MODALS ⇊ */}

      <UserProductMenu
        isOpen={activeModal === 'USER_PRODUCT_INFO'}
        onCloseActions={() => setActiveModal(null)}
        onImageClick={() => setActiveModal('EXPAND_IMAGE')}
        product={{
          imageUrl: userProduct.imageUrl,
          name: userProduct.name,
          category: userProduct.category,
          description: userProduct.description ?? '[Sem descrição]',
          price: userProduct.price,
        }}
        orders={userProduct.orders.map(order => ({
          id: order.id,
          orderedAmount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          orderDate: order.acceptedAt ?? '',
          orderTotalPrice: order.total,
        }))}
        search={{
          order: orderSearch,
          filter: orderFilter ?? 'most_recent',
          onSearch: (e) => setOrderSearch(e.target.value),
          onFilter: (e) => setOrderFilter(e.target.value as UserProductOrdersFilterValue),
          onClearSearch: () => setOrderSearch(''),
        }}
      />

      <ProductComment
        isOpen={activeModal === 'COMMENT'}
        onCloseActions={() => {
          setActiveModal(null);
          setError('');
        }}
        onChange={{ textArea: (e) =>  {
          setProductComment(e.target.value);
          setError('');
        }}}
        onClick={{ comment: () =>  {
          if (!productComment) {
            setError('Não se pode mandar um comentário vazio');
          } else {
            handleCommentRatingProduct();
            setActiveModal(null);
          }
        }}}
        hasReview={userProduct.hasReview}
        misc={{ error }}

      />

      <ImageExpand modal={{
          isOpen: activeModal === 'EXPAND_IMAGE',
          onCloseActions: () => setActiveModal('USER_PRODUCT_INFO'),
        }} product={{
          imageUrl: userProduct.imageUrl,
          name: userProduct.name
        }}
      />

      <RemoveUserProduct
        isOpen={activeModal === 'REMOVE_PRODUCT_CONFIRM'}
        onCloseActions={() => setActiveModal(null)}
        loading={loading}
        onClick={{
          yes: () => handleRemoveUserProduct(),
          no: () => setActiveModal(null),
        }}
      />

    </motion.div>
  )
}

export default MyProduct