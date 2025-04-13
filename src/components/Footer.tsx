import { FaInstagram } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import Logo from "@/assets/icons/logo.svg";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className=" bg-white shadow-2xl mt-12 px-6 md:px-32">
      <div className="py-8">
        <div className="flex justify-between items-center">
          <img
            src={Logo}
            alt="My Menu Logo"
            width={80}
            height={80}
          />
          <div className="text-gray-500 flex gap-2">
            <a href="https://www.instagram.com/mymenu.br/" target="_blank">
              <FaInstagram size={25} />
            </a>
            <a href="contato@my-menu.net" type="email">
              <MdOutlineAlternateEmail size={25} />
            </a>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex gap-4">
            <Link to="/auth" className="text-gray-500">
              Entrar
            </Link>
          </div>
        </div>
      </div>

      <hr className="w-full" />

      <p className="text-center text-gray-400 py-8">
        <small>&copy; 2025 My Menu. Todos os direitos reservados.</small>
      </p>
    </footer>
  );
}
