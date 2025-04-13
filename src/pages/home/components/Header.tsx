import Logo from "@/assets/icons/logo.svg";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header
      className="w-full flex justify-between items-center h-28 px-6 md:px-20 bg-white"
      style={{ boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.1)" }}
    >
      <img src={Logo} alt="My Menu Logo" width={70} height={70} />
      <nav className="flex flex-row items-center gap-2 md:gap-4">
        <Link to="/auth">Entrar</Link>
      </nav>
    </header>
  );
}
