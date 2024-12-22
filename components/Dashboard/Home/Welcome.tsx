"use client";

import useCompany from "@/hooks/queries/useCompany";
import useUser from "@/hooks/queries/useUser";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { SlScreenSmartphone } from "react-icons/sl";

export function Welcome() {
  const { data: user } = useUser();
  const { data: company, isLoading } = useCompany();

  return (
    <div className="flex-1">
      {!isLoading && company ? (
        <div className="h-72 flex flex-row justify-around bg-white border border-gray-200 p-4 rounded-xl ">
          <div>
            <h1 className="text-xl font-semibold">Bem vindo, {user?.name}</h1>
            <h2 className="text-gray-400">
              Acompanhe o progresso de acesso da sua empresa, {company?.name}
            </h2>
            <div className="flex flex-col items-start mt-4 min-w-[200px]">
              <ContactComponent>
                <SlScreenSmartphone />
                {company?.phone}
              </ContactComponent>
              <ContactComponent>
                <MdOutlineAlternateEmail />
                {company?.email}
              </ContactComponent>
              {company?.address && (
                <p className="flex flex-row gap-1 mt-2 line-clamp-1 whitespace-break-spaces">
                  {company.address.state}, {company.address.city} -{" "}
                  {company.address.street}, {company.address.number}
                  {company.address.complement && (
                    <>, {company.address.complement}</>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="max-w-[400px]">
            <Image
              alt="Home"
              height={0}
              width={0}
              src={"/images/kitchen-delivery.jpg"}
              className="w-full object-contain hidden 2xl:block"
              unoptimized={true}
            />
          </div>
        </div>
      ) : (
        <Skeleton className="w-full h-[300px] rounded-xl" />
      )}
    </div>
  );
}

type ContactComponentProps = {
  children: React.ReactNode;
};

const ContactComponent = ({ children }: ContactComponentProps) => {
  return (
    <p className="flex flex-row gap-2 justify-center items-center line-clamp-1">
      {children}
    </p>
  );
};
