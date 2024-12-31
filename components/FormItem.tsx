type FormItemProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  first?: boolean;
};

export default function FormItem({
  title,
  subtitle,
  children,
  first,
}: FormItemProps) {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-2 mb-6 md:mb-0">
      <div
        className={`md:w-[250px] md:border-r-1 pr-4 ${!first && "md:pt-12"}`}
      >
        <h2 className="mb-2">{title}</h2>
        <h3 className="text-xs text-gray-400">{subtitle}</h3>
      </div>

      <div className={`min-w-[200px] flex-1 ${!first && "md:pt-12"}`}>
        {children}
      </div>
    </div>
  );
}
