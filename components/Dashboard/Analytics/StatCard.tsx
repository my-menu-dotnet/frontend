import Block from "@/components/Block";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon?: ReactNode;
  isLoading?: boolean;
  growth?: number;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  isLoading = false,
  growth,
  className = "",
}: StatCardProps) {
  if (isLoading) {
    return (
      <Block className={`h-32 ${className}`}>
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-1/3" />
      </Block>
    );
  }

  return (
    <Block className={`h-32 flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
          </p>
        </div>
        {icon && (
          <div className="text-2xl text-muted-foreground ml-4">{icon}</div>
        )}
      </div>
      
      {growth !== undefined && (
        <div className="flex items-center mt-2">
          <span
            className={`text-sm font-medium ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
          </span>
          <span className="text-sm text-muted-foreground ml-2">vs. período anterior</span>
        </div>
      )}
    </Block>
  );
}
