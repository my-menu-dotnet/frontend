type CardProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl w-full p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
