import * as React from "react";
import {
  Tabs as ShadcnTabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent as ShadcnTabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ShadcnTabsProps = React.ComponentProps<typeof ShadcnTabs>;
type TabsPropsInherited = {
  /** Controlled active tab value. */
  value?: string;
  /** Handler called when the active tab changes. */
  onValueChange?: (value: string) => void;
  /** Uncontrolled initial active tab value. */
  defaultValue?: string;
  /** Hero-UI alias for `value`. */
  selectedKey?: string;
  /** Hero-UI alias for `onValueChange`. */
  onSelectionChange?: (key: string) => void;
  /** Custom className for the underlying <Tabs> root. */
  className?: string;
  /** Vertical/horizontal orientation passthrough. */
  orientation?: "horizontal" | "vertical";
};

export type BlockProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  /** Optional Tabs markup to render at the top of the block. */
  tabs?: React.ReactNode;
  /** Props passed to the underlying shadcn Tabs. */
  tabsProps?: TabsPropsInherited;
};

export default function Block({
  children,
  className,
  tabs,
  tabsProps,
  ...rest
}: BlockProps) {
  const {
    value: controlledValue,
    onValueChange,
    defaultValue,
    selectedKey,
    onSelectionChange,
    className: tabsClassName,
    orientation,
    ...tabsRest
  } = tabsProps ?? {};

  const resolvedValue = controlledValue ?? selectedKey;
  const handleChange = (v: string) => {
    onValueChange?.(v);
    onSelectionChange?.(v);
  };

  return (
    <div
      className={cn(
        "bg-card text-card-foreground border border-border rounded-xl w-full",
        !tabs ? "p-6" : "pb-4",
        className,
      )}
      {...rest}
    >
      {tabs ? (
        <>
          <ShadcnTabs
            value={resolvedValue}
            onValueChange={handleChange}
            defaultValue={defaultValue}
            orientation={orientation as ShadcnTabsProps["orientation"]}
            className={cn("w-full", tabsClassName)}
            {...tabsRest}
          >
            {tabs}
          </ShadcnTabs>
          <div className="px-6 mt-4">{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

export const Tabs = ShadcnTabs;
export const TabsList = ShadcnTabsList;
export const TabsTrigger = ShadcnTabsTrigger;
export const TabsContent = ShadcnTabsContent;
