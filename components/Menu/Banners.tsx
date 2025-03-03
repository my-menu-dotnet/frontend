"use client";

import { Menu } from "@/types/api/Menu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Banner as IBanner } from "@/types/api/Banner";
import Banner from "../Banner";
import Link from "next/link";

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
            <Link
              key={banner.id}
              href={getHref(banner) || ""}
              target="_blank"
              rel="noreferrer"
              className="block w-full relative"
            >
              <div className="relative w-full aspect-video md:aspect-[3/1]">
                <Image
                  src={banner.image.url}
                  alt={menu.company.name}
                  fill
                  quality={100}
                  priority
                  className="object-cover absolute inset-0 rounded-md"
                />
              </div>
            </Link>
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
