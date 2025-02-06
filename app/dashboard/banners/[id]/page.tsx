"use client";

import Block from "@/components/Block";
import BannerForm from "@/components/Dashboard/Banner/BannerForm";
import useBanner from "@/hooks/queries/banner/useBanner";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: banner } = useBanner(id);

  return banner && (
    <Block>
      <BannerForm banner={banner} />
    </Block>
  );
}
