import * as React from "react"
import { cn } from "@/lib/utils"

function FieldGroup({ className, ...props }) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function Field({ className, ...props }) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldSeparator({ className, children, ...props }) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative my-2 text-center text-xs", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <span className="relative z-10 bg-card px-2 text-muted-foreground uppercase text-[0.7rem] font-bold tracking-wider">
        {children}
      </span>
    </div>
  )
}

export {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
}
