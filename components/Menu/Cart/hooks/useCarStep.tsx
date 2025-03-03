"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import CartSteps from "../components/CartSteps";
import useUser from "@/hooks/queries/useUser";

interface CartStepContextProps {
  step: number;
  addStep: () => void;
  removeStep: () => void;
}

const CartStepContext = createContext<CartStepContextProps | undefined>(
  undefined
);

interface CartStepProviderProps {
  maxSteps: number;
  children: ReactNode;
}

export const CartStepProvider: React.FC<CartStepProviderProps> = ({
  maxSteps,
  children,
}) => {
  const [step, setStep] = useState(0);

  const addStep = () => {
    if (step < maxSteps) {
      setStep(step + 1);
    }
  };

  const removeStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <CartStepContext.Provider value={{ step, addStep, removeStep }}>
      <CartSteps>{children}</CartSteps>
    </CartStepContext.Provider>
  );
};

export const useCartStep = (): CartStepContextProps => {
  const context = useContext(CartStepContext);
  if (context === undefined) {
    throw new Error("useCartStep must be used within a CartStepProvider");
  }
  return context;
};
