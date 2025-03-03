"use client";

import { ReactNode, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";

type BannerProps<T> = {
  itemList: T[];
  renderItem: (item: T) => ReactNode;
};

export default function Banner<T>({ itemList, renderItem }: BannerProps<T>) {
  const [currentItem, setCurrentItem] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setCurrentItem((currentItem + 1) % itemList.length);
  };

  const handlePrevious = () => {
    setCurrentItem((currentItem - 1 + itemList.length) % itemList.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div
      className="w-full flex gap-4 relative text-gray-200 rounded-md "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-gray-400/80 rounded-full p-2 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        onClick={handlePrevious}
      >
        <FaChevronLeft size={20} />
      </button>
      {renderItem(itemList[currentItem])}
      <button
        className={`absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-gray-400/80 rounded-full p-2 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleNext}
      >
        <FaChevronRight size={20} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-2">
        {itemList.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full bg-gray-400/80 transition-opacity duration-300 ${
              index === currentItem ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setCurrentItem(index)}
          />
        ))}
      </div>
    </div>
  );
}
