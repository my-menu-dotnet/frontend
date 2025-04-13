import {
  TooltipContent as UiTooltipContent,
  TooltipProvider as UiTooltipProvider,
  TooltipTrigger as UiTooltipTrigger,
  Tooltip as UiTooltip,
} from "./_ui/tooltip";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode | string;
};

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <UiTooltipProvider>
      <UiTooltip>
        <UiTooltipTrigger>{children}</UiTooltipTrigger>
        <UiTooltipContent>{content}</UiTooltipContent>
      </UiTooltip>
    </UiTooltipProvider>
  );
}
