import { DetailedHTMLProps, HTMLAttributes } from "react";

type BlockProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export default function Block({ children, className = "", ...rest }: BlockProps) {
  return (
    <div
      className={`bg-white border border-gray-200 p-4 rounded-xl w-full ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
