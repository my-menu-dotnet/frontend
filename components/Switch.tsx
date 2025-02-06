import {
  Switch as NextSwitch,
  SwitchProps as NextSwitchProps,
} from "@nextui-org/react";

type SwitchProps = NextSwitchProps & {};

function Switch({ children, ...rest }: SwitchProps) {
  return <NextSwitch {...rest}>{children}</NextSwitch>;
}

type StatusProps = Omit<Omit<SwitchProps, "value">, "onChange"> & {
  value: "ACTIVE" | "INACTIVE";
  onChange: (value: "ACTIVE" | "INACTIVE") => void;
};

function Status({ value, onChange, ...rest }: StatusProps) {
  return (
    <Switch
      isSelected={value === "ACTIVE"}
      onValueChange={(value) => {
        onChange(value ? "ACTIVE" : "INACTIVE");
      }}
      {...rest}
    >
      {value === "ACTIVE" ? "Ativo" : "Inativo"}
    </Switch>
  );
}

type ActiveProps = Omit<Omit<SwitchProps, "onChange">, "value"> & {
  value: boolean;
  onChange?: (value: boolean) => void;
};

function Active({ value, onChange, ...rest }: ActiveProps) {
  return (
    <Switch
      isSelected={value}
      onValueChange={(value) => {
        onChange?.(value);
      }}
      {...rest}
    >
      {value ? "Ativo" : "Inativo"}
    </Switch>
  );
}

Switch.Status = Status;
Switch.Active = Active;

export default Switch;
