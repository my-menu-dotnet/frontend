import Block from "@/components/Block";
import BannerForm from "@/components/Dashboard/Banner/BannerForm";
import useBanner from "@/hooks/queries/banner/useBanner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/banners/$id")({
  component: BannerEditPage,
});

function BannerEditPage() {
  const { id } = Route.useParams();
  const { data: banner } = useBanner(id);

  return (
    banner && (
      <Block>
        <BannerForm banner={banner} />
      </Block>
    )
  );
}
