import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex data-[orientation=horizontal]:flex-col", className)}
      {...props} />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
        // Icon rail across the top of a card: tall two-line triggers, a
        // hairline base, and horizontal scroll on narrow screens.
        strip:
          "h-auto! w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-rule bg-transparent p-0 no-scrollbar",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        // --- strip variant ---
        "group-data-[variant=strip]/tabs-list:h-auto group-data-[variant=strip]/tabs-list:min-w-[7.5rem]",
        "group-data-[variant=strip]/tabs-list:shrink-0 group-data-[variant=strip]/tabs-list:flex-col",
        "group-data-[variant=strip]/tabs-list:gap-1.5 group-data-[variant=strip]/tabs-list:rounded-none",
        "group-data-[variant=strip]/tabs-list:px-4 group-data-[variant=strip]/tabs-list:py-3.5",
        "group-data-[variant=strip]/tabs-list:text-[0.8rem] group-data-[variant=strip]/tabs-list:font-bold",
        "group-data-[variant=strip]/tabs-list:whitespace-normal",
        // Base uses text-foreground/60 (3.58:1 on white) — too light for a
        // 12.8px label. The muted token clears AA at 5.0:1.
        "group-data-[variant=strip]/tabs-list:text-muted-foreground",
        "group-data-[variant=strip]/tabs-list:bg-transparent",
        "group-data-[variant=strip]/tabs-list:data-[state=active]:bg-transparent",
        "group-data-[variant=strip]/tabs-list:data-[state=active]:shadow-none",
        // Active underline as a bottom border rather than the base's ::after
        // (whose after:opacity-0 is hard to override from a variant). Every
        // trigger carries the 3px border transparently, so activating one
        // shifts nothing, and -mb-px lays it over the list's own hairline.
        "group-data-[variant=strip]/tabs-list:-mb-px",
        "group-data-[variant=strip]/tabs-list:border-b-[3px]",
        "group-data-[variant=strip]/tabs-list:border-b-transparent",
        "group-data-[variant=strip]/tabs-list:data-[state=active]:border-b-current",
        "group-data-[variant=strip]/tabs-list:[&_svg:not([class*=size-])]:size-6",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      {...props} />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
