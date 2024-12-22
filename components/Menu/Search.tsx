"use client";

import Input from "../Input";
import { IoIosSearch } from "react-icons/io";

export default function Search() {
  return (
    <Input
      className="max-w-[600px] outline-none"
      startContent={<IoIosSearch size={24} className="text-gray-400" />}
      placeholder="Digite o item que deseja buscar"
    />
  );
}
