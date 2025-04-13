import { Link } from "@tanstack/react-router";
import AdvantageItem from "./components/AdvantageItem";
import { BiFoodMenu } from "react-icons/bi";
import { LuQrCode } from "react-icons/lu";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import HomeImage from "@/assets/icons/home.svg";
import Header from "./components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div style={{ fontFamily: "Montserrat" }}>
      <Header />
      <main className="px-6 md:px-20">
        <section className="flex flex-row justify-center lg:justify-between items-center">
          <div className="lg:max-w-[50%]">
            <h2 className="text-lg font-bold text-primary">CARDÁPIO DIGITAL</h2>
            <h1
              className="text-4xl mt-4 max-w-[570px] font-semibold"
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
              <Link to="/auth">Começar agora</Link>

              <a href={"#about"}>
                <span className="font-bold text-primary">Saiba mais</span>
              </a>
            </div>
          </div>
          <div className="w-full lg:flex justify-center items-center hidden">
            <img
              src={HomeImage}
              alt="Kitchen Delivery"
              width={500}
              height={500}
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
              <AdvantageItem
                icon={<MdAttachMoney size={20} />}
                title="Gratuito"
                description="Crie seu cardápio digital de forma gratuita."
              />
              <AdvantageItem
                icon={<BiFoodMenu size={20} />}
                title="Cardápios personalizados"
                description="Crie cardápios personalizados com a cara do seu negócio."
              />
              <AdvantageItem
                icon={<LuQrCode size={20} />}
                title="QR Code e link personalizado"
                description="Divulgue seu cardápio por QR Code e link personalizado."
              />
              <AdvantageItem
                icon={<RiDiscountPercentLine size={20} />}
                title="Promoções e descontos"
                description="Atraia mais clientes com promoções e descontos exclusivos."
              />
            </div>
          </div>
        </section>

        <section className="w-full flex items-center justify-center mt-20">
          <div
            className="bg-primary w-auto md:w-full max-w-[1200px] min-h-24 p-6 rounded-lg flex flex-col md:flex-row items-center justify-around text-white text-center shadow-lg gap-8 md:gap-0 font-semibold"
          >
            <h3 className="w-40">
              {/* <span className="block">+{homeResponse.total_access}</span> */}
              Acessos
            </h3>
            <h3 className="w-40">
              {/* <span className="block">+{homeResponse.total_companies}</span> */}
              Menus criado
            </h3>
            <h3 className="w-40">
              {/* <span className="block">+{homeResponse.total_food}</span> */}
              Itens cadastrados
            </h3>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
