"use client";

import { Menu } from "@/types/api/Menu";
import { useEffect, useState } from "react";
import { Banner as IBanner } from "@/types/api/Banner";
import Banner from "../Banner";

type BannersProps = {
  menu: Menu;
};

export default function Banners({ menu }: BannersProps) {
  const [banners, setBanners] = useState<IBanner[]>([]);

  useEffect(() => {
    const width = window.innerWidth;

    const banners = menu.banners.reduce((acc, banner) => {
      if (width < 768 && banner.type === "MOBILE") {
        acc.push(banner);
      }
      if (width >= 768 && banner.type === "DESKTOP") {
        acc.push(banner);
      }
      return acc;
    }, [] as IBanner[]);

    setBanners(banners);
  }, []);

  return (
    banners.length > 0 && (
      <section className="flex flex-row gap-4 mt-4">
        <Banner
          itemList={banners}
          renderItem={(banner) => (
            <a
              key={banner.id}
              href={getHref(banner) || ""}
              target="_blank"
              rel="noreferrer"
              className="block w-full relative"
            >
              <div className="relative w-full aspect-video md:aspect-[3/1]">
                <img
                  src={banner.image.url}
                  alt={menu.company.name}
                  className="object-cover absolute inset-0 rounded-md w-full h-full"
                />
              </div>
            </a>
          )}
        />
      </section>
    )
  );
}

const getHref = (banner: IBanner) => {
  switch (banner.redirect) {
    case "URL":
      return banner.url;
    case "CATEGORY":
      return `#${banner.category?.id}`;
    case "FOOD":
      return `#${banner.food?.id}`;
    default:
      return "";
  }
};
