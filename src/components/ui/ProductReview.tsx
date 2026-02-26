import Image from "next/image"
import imagePlaceHolder from '@/public/Profile_avatar_placeholder_large.png';
import { ROLE_LABEL } from "@/src/constants/generalConfigs";
import { ProductReviewsDTO } from "@/src/types/productReviewsDTO";
import { timeAgo } from "@/src/utils/timeAgo";
import Rating from "./Rating";
import { useState } from "react";

type Props = {
  item: ProductReviewsDTO;
}

const ProductReview = ({
  item,
}:Props) => {

  const MAX_COMMENT_LENGTH = 120;
  const [readMore, setReadMore] = useState<boolean>(false);

  return (
    <div className='bg-secondary/20 border space-y-2 border-secondary rounded-2xl p-3'>
      <div className='flex gap-3 text-gray items-center'>
        <div className='border-2 border-primary rounded-full p-0.5'>
          <Image
            src={item.reviewer.profileImage || imagePlaceHolder} 
            alt={item.reviewer.name || ''}
            height={40}
            width={40}
            className='aspect-square rounded-full object-cover'
          />
        </div>              

        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <span className='text-cyan'>
              {item.reviewer.name}
            </span>

            <span className='text-xs'>●</span>

            <span>
              {timeAgo(item.comment.at)}
            </span>
          </div>

          <span className='text-white'>
            {ROLE_LABEL[item.reviewer.role]}
          </span>
        </div>
      </div>

      <p className='flex flex-col text-primary bg-primary/20 rounded-lg p-1 px-2'>
        {item.comment.text ? (
          <>
          {(item.comment.text.length > MAX_COMMENT_LENGTH && !readMore)
            ? item.comment.text.slice(0, MAX_COMMENT_LENGTH) + '...'
            : item.comment.text
          }

          {item.comment.text.length > MAX_COMMENT_LENGTH && (
            <button 
              className='text-gray self-start hover:text-white cursor-pointer transition duration-200 mt-1'
              onClick={() => setReadMore(prev => !prev)}
            >
              {readMore ? 'Ler menos' : 'Ler mais'}
            </button>
          )}
          </>
        ) : (
          '[ Não foi possível carregar a mensagem ]'
        )}
      </p>

      <span className='scale-[1.025]'>
        <Rating 
          value={item.rating.rate}
          static
        />
      </span>
    </div>
  )
}

export default ProductReview