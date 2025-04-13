type DividerProps = React.ComponentProps<"hr">;

export default function Divider({ className, ...rest }: DividerProps) {
  return (
    <hr className={`border-t border-gray-200 my-4 ${className}`} {...rest} />
  );
}
