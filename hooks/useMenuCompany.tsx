"use client";

import { Company } from "@/types/api/Company";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuCompanyContextProps {
  company: Company;
  setCompany: (company: Company) => void;
}

const MenuCompanyContext = createContext<MenuCompanyContextProps | undefined>(
  undefined
);

export const MenuCompanyProvider: React.FC<{
  children: ReactNode;
  company: Company;
}> = ({ company: providadedCompany, children }) => {
  const [company, setCompany] = useState<Company>(providadedCompany);

  return (
    <MenuCompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </MenuCompanyContext.Provider>
  );
};

export const useMenuCompany = (): MenuCompanyContextProps => {
  const context = useContext(MenuCompanyContext);
  if (!context) {
    throw new Error("useMenuCompany must be used within a MenuCompanyProvider");
  }
  return context;
};
