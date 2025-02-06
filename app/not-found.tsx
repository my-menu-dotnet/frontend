import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl font-bold text-gray-600">
        Página não encontrada
      </h1>
      <p className="text-lg text-gray-500">
        A página que você está procurando não existe.
      </p>
      <Link className="mt-4" href="/">
        <span className="text-primary hover:text-primary/70 font-bold">Voltar para a página inicial</span>
      </Link>
    </div>
  );
}
