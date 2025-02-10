import Image from "next/image";
import Logo from "@/assets/logo.svg";
import Link from "next/link";
import HomeImage from "@/assets/home.svg";
import { Montserrat } from "next/font/google";
import { BiFoodMenu } from "react-icons/bi";
import { LuQrCode } from "react-icons/lu";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import api from "@/services/api";
import { HomeResponse } from "@/types/api/HomeResponse";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ weight: "900", subsets: ["latin"] });

async function getHomeResponse() {
  const homeResponse: HomeResponse = (await api.get("/home")).data;
  return homeResponse;
}

export default async function Home() {
  const homeResponse = await getHomeResponse();

  if (!homeResponse) {
    return <></>;
  }

  return (
    <>
      <header className="w-full flex justify-between items-center h-36 px-6 md:px-20">
        <Image
          src={Logo}
          alt="My Menu Logo"
          width={70}
          height={70}
          quality={100}
          priority
        />
        <nav className="flex flex-row items-center gap-2 md:gap-4">
          <NavLink href="/auth/login" buttonProps={{ variant: "bordered" }}>
            Entrar
          </NavLink>
          <NavLink href="/auth/register">Cadastre-se</NavLink>
        </nav>
      </header>
      <main className="px-6 md:px-20">
        <section className="flex flex-row justify-center lg:justify-between items-center">
          <div className="lg:max-w-[50%]">
            <h2 className="text-lg font-bold text-primary">CARDÁPIO DIGITAL</h2>
            <h1
              className="text-4xl mt-4 max-w-[570px]"
              style={montserrat.style}
            >
              Crie seu cardápio digital personalizado!
            </h1>
            <p className="text-lg text-gray-400 mt-8">
              Modernize seu restaurante com um cardápio digital acessível via QR
              Code e link personalizado. Fácil de criar, editar e compartilhar.
              Aumente suas vendas e ofereça uma experiência única aos seus
              clientes!
            </p>

            <div className="flex flex-row items-center mt-12 gap-6">
              <NavLink href={"/auth/register"}>Começar agora</NavLink>

              <Link href={"#about"}>
                <span className="font-bold text-primary">Saiba mais</span>
              </Link>
            </div>
          </div>
          <div className="w-full lg:flex justify-center items-center hidden">
            <Image
              src={HomeImage}
              alt="Kitchen Delivery"
              quality={100}
              width={500}
              height={500}
              priority
            />
          </div>
        </section>

        <section className="mt-20 flex flex-wrap flex-row items-center gap-8">
          <aside className="max-w-[400px]">
            <h2 className="text-xl">
              Por que escolher o nosso{" "}
              <span className="font-bold">Cardápio Digital?</span>
            </h2>
            <p className="text-gray-400 mt-2">
              O My Menu é a solução ideal para você que deseja modernizar o seu
              negócio e oferecer uma experiência única aos seus clientes de
              forma totalmente gratuita.
            </p>
          </aside>

          <div className="flex-1 min-w-[300px] md:min-w-[400px]">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
              <Item
                icon={<MdAttachMoney size={20} />}
                title="Gratuito"
                description="Crie seu cardápio digital de forma gratuita."
              />
              <Item
                icon={<BiFoodMenu size={20} />}
                title="Cardápios personalizados"
                description="Crie cardápios personalizados com a cara do seu negócio."
              />
              <Item
                icon={<LuQrCode size={20} />}
                title="QR Code e link personalizado"
                description="Divulgue seu cardápio por QR Code e link personalizado."
              />
              <Item
                icon={<RiDiscountPercentLine size={20} />}
                title="Promoções e descontos"
                description="Atraia mais clientes com promoções e descontos exclusivos."
              />
            </div>
          </div>
        </section>

        <section className="w-full flex items-center justify-center mt-20">
          <div
            className="bg-primary w-auto md:w-full max-w-[1200px] min-h-24 p-6 rounded-lg flex flex-col md:flex-row items-center justify-around text-white text-center shadow-lg gap-8 md:gap-0"
            style={montserrat.style}
          >
            <h3 className="w-40">
              <span className="block">+{homeResponse.total_access}</span>{" "}
              Acessos
            </h3>
            <h3 className="w-40">
              <span className="block">+{homeResponse.total_companies}</span>{" "}
              Menus criado
            </h3>
            <h3 className="w-40">
              <span className="block">+{homeResponse.total_food}</span> Itens
              cadastrados
            </h3>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

type ItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Item = ({ icon, title, description }: ItemProps) => {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="min-w-12 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

{
  /* <div className="mt-6 flex justify-center gap-2 text-primary">
              <Tooltip content="Crie cardápios" placement="bottom">
                <BiFoodMenu size={25} />
              </Tooltip>
              <Tooltip content="Divulgue por QR Code" placement="bottom">
                <LuQrCode size={25} />
              </Tooltip>
              <Tooltip
                content="Compartilhe seu link personalizado"
                placement="bottom"
              >
                <IoIosLink size={25} />
              </Tooltip>
              <Tooltip content="Promoções e descontos" placement="bottom">
                <RiDiscountPercentLine size={25} />
              </Tooltip>
            </div> */
}
