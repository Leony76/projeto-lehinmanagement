'use client';

import { useState } from 'react';
import { IoIosStar, IoIosStarOutline } from 'react-icons/io';

type RatingProps = {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
};

const Rating = ({
  max = 5,
  value = 0,
  onChange,
}: RatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const currentValue = hovered ?? value;

  return (
    <div className="flex gap-1 text-yellow text-4xl xl:text-[27px]">
    {Array.from({ length: max }, (_, i) => {
      const starValue = i + 1;
      const filled = starValue <= currentValue;
      const isSelected = value >= starValue;

      return (
        <button
          key={starValue}
          type="button"
          aria-label={`Avaliar com ${starValue} estrela${starValue > 1 ? 's' : ''}`}
          className={`
            relative cursor-pointer focus:outline-none
            transition-all duration-300 ease-out
            ${filled ? 'scale-110 opacity-100' : 'scale-100 opacity-60'}
            ${isSelected ? 'drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]' : ''}
          `}
          onMouseEnter={() => setHovered(starValue)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            onChange?.(starValue);
          }}
        >
          <IoIosStar
            className={`
              absolute inset-0
              transition-opacity duration-300
              ${filled ? 'opacity-100' : 'opacity-0'}
            `}
          />

          <IoIosStarOutline
            className={`
              transition-opacity duration-300
              ${filled ? 'opacity-0' : 'opacity-100'}
            `}
          />
        </button>
      );
    })}
  </div>
  );
}

export default Rating;
