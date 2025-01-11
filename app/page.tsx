import Image from "next/image";
import Logo from "@/assets/logo.svg";
import { IoMdArrowForward } from "react-icons/io";
import Button from "@/components/Button";
import Link from "next/link";
import { BiFoodMenu } from "react-icons/bi";
import { Tooltip } from "@nextui-org/react";
import { LuQrCode } from "react-icons/lu";
import { IoIosLink } from "react-icons/io";
import { RiDiscountPercentLine } from "react-icons/ri";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col gap-6 items-center justify-center h-screen">
        <Image src={Logo} alt="My Menu Logo" width={80} height={80} priority />
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Bem vindo ao My Menu
          </h1>
          <p className="text-center text-gray-500 mt-4">
            Crie e gerencie seus cardápios de forma fácil e rápida
          </p>

          <div className="mt-6 flex justify-center gap-2 text-primary">
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
          </div>

          <Link href="/auth/login">
            <Button endContent={<IoMdArrowForward />} variant="bordered" className="w-full mt-6">
              <p className="w-full text-start">Começar</p>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
