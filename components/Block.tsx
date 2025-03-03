"use client";

import { Tabs, TabsProps } from "@nextui-org/react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type BlockProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  tabs?: React.ReactNode;
  tabsProps?: TabsProps;
};

export default function Block({
  children,
  className = "",
  tabs,
  tabsProps,
  ...rest
}: BlockProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl w-full ${
        !tabs ? "p-6" : "pb-4"
      } ${className}`}
      {...rest}
    >
      {tabs ? (
        <>
          <Tabs
            aria-label="Options"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              base: "w-full",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-14",
              tabContent: "group-data-[selected=true]:text-primary",
            }}
            color="primary"
            variant="underlined"
            {...tabsProps}
          >
            {tabs}
          </Tabs>
          <div className={"px-6 mt-4"}>{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
