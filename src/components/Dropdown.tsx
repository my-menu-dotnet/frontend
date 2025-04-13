import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";

type DropdownProps = {
  content: React.ReactNode | string;
  asChild?: boolean;
  children: React.ReactNode;
};

function Dropdown({ content, asChild = true, children }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={asChild}>{content}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

Dropdown.Item = DropdownMenuItem;
Dropdown.Label = DropdownMenuLabel;

export default Dropdown;
