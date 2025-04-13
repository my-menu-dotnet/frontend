type AdvantageItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function AdvantageItem({
  icon,
  title,
  description,
}: AdvantageItemProps) {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="min-w-12 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}
