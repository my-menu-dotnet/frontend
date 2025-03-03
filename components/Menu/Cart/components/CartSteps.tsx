"use client";

import { BsCart3 } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import { Children, useEffect } from "react";
import "../css/steps.css";
import { useCartStep } from "../hooks/useCarStep";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { useCart } from "@/hooks/useCart";

type CartStepsProps = {
  children: React.ReactNode;
};

export default function CartSteps({ children }: CartStepsProps) {
  const params = useParams();
  const menuId = params.id as string;
  const { step } = useCartStep();

  const childrenArray = Children.toArray(children);

  useEffect(() => {
    api.defaults.headers["_company"] = menuId;
  }, []);

  return (
    <>
      <section className="px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex w-full items-center justify-center mb-12 text-gray-400">
            <Step
              icon={<BsCart3 size={24} className="text-gray-400" />}
              selected={step === 0}
            >
              Carrinho
            </Step>
            <Step
              icon={<MdOutlineEmail size={24} className="text-gray-400" />}
              selected={step === 1}
            >
              E-mail
            </Step>
            <Step
              icon={
                <HiOutlineLocationMarker size={24} className="text-gray-400" />
              }
              selected={step === 2}
            >
              Endereço
            </Step>
            <Step
              icon={<MdPayment size={24} className="text-gray-400" />}
              selected={step === 3}
            >
              Pagamento
            </Step>
          </div>

          {childrenArray[step] || childrenArray[0]}
        </div>
      </section>
    </>
  );
}

type StepProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  selected: boolean;
};

const Step = ({ icon, children, selected }: StepProps) => {
  return (
    <div
      className="flex flex-col items-center gap-1 w-20 step"
      data-active={selected}
    >
      <div className="border-2 rounded-full bg-gray-100 w-11 h-11 flex justify-center items-center">
        {icon}
      </div>
      <div className="absolute -bottom-6">
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
};
