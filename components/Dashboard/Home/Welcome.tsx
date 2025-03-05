"use client";

import Block from "@/components/Block";
import Button from "@/components/Button";
import useUser from "@/hooks/queries/useUser";
import { usePrint } from "@/hooks/usePrint";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { SlScreenSmartphone } from "react-icons/sl";

export function Welcome() {
  const { data: user, company, isLoading } = useUser();
  const { grantPermissionToUsePrinter } = usePrint();

  const handleClick = () => {
    grantPermissionToUsePrinter();
  };

  return (
    <>
      {!isLoading && company ? (
        <Block className="h-80 flex flex-row justify-between">
          <div className="flex-1 text-sm md:text-medium overflow-hidden">
            <h1 className="text-xl font-semibold">Bem vindo, {user?.name}</h1>
            <h2 className="text-gray-400">
              Acompanhe o progresso de acesso da sua empresa, {company?.name}
            </h2>
            <div className="flex flex-col items-start mt-4">
              <ContactComponent icon={<SlScreenSmartphone />}>
                {company?.phone}
              </ContactComponent>
              <ContactComponent icon={<MdOutlineAlternateEmail />}>
                {company?.email}
              </ContactComponent>

              {company?.address && (
                <p className="flex flex-row gap-1 mt-6 line-clamp-1 whitespace-break-spaces text-gray-400">
                  {company.address.street}, {company.address.number}
                  {company.address.complement &&
                    `, ${company.address.complement}`}{" "}
                  - {company.address.city}, {company.address.state}
                </p>
              )}
              <Button className="mt-4" onPress={handleClick}>Imprimir</Button>
            </div>
          </div>
          <div className="max-w-[400px]">
            <Image
              alt="Home"
              height={0}
              width={0}
              src={"/images/kitchen-delivery.jpg"}
              className="w-full object-contain hidden lg:block"
              unoptimized={true}
            />
          </div>
        </Block>
      ) : (
        <Skeleton className="w-full h-80 rounded-xl" />
      )}
    </>
  );
}

type ContactComponentProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
};

const ContactComponent = ({ icon, children }: ContactComponentProps) => {
  return (
    <div className="max-w-[250px] flex justify-center items-center gap-2">
      {icon}
      <p className="truncate overflow-hidden whitespace-nowrap text-sm md:text-medium">
        {children}
      </p>
    </div>
  );
};
