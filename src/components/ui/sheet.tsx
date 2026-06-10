"use client"

import * as React from "react"
import {Dialog as SheetPrimitive} from "radix-ui"

import {cn} from "@/src/lib/utils"
import {Button} from "@/src/components/ui/button"
import {XIcon} from "lucide-react"

function Sheet({...props}: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
	                      ...props
                      }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
	                    ...props
                    }: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
	                     ...props
                     }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({className, ...props}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
			<SheetPrimitive.Overlay
					data-slot="sheet-overlay"
					className={cn(
							"fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
							"data-[state=open]:animate-in data-[state=open]:fade-in-0",
							"data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
							className
					)}
					{...props}
			/>
	)
}

function SheetContent({
	                      className,
	                      children,
	                      side = "right",
	                      showCloseButton = true,
	                      ...props
                      }: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: "top" | "right" | "bottom" | "left"
	showCloseButton?: boolean
}) {
	return (
			<SheetPortal>
				<SheetOverlay/>
				<SheetPrimitive.Content
						data-slot="sheet-content"
						data-side={side}
						className={cn(
								"fixed z-50 flex flex-col gap-4 bg-[#0a0a0a] shadow-lg",
								"data-[state=open]:animate-in data-[state=closed]:animate-out",

								// Side specific logic
								"data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 sm:max-w-sm",
								"data-[side=right]:data-[state=open]:slide-in-from-right",
								"data-[side=right]:data-[state=closed]:slide-out-to-right",

								className
						)}
						{...props}
				>
					{children}

					{/* FIXES THE CONSOLE WARNING */}
					<SheetPrimitive.Description className="sr-only">
						Shopping Cart Content
					</SheetPrimitive.Description>

					{showCloseButton && (
							<SheetPrimitive.Close
									className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
								<XIcon className="h-5 w-5 text-white"/>
								<span className="sr-only">Close</span>
							</SheetPrimitive.Close>
					)}
				</SheetPrimitive.Content>
			</SheetPortal>
	)
}

function SheetHeader({className, ...props}: React.ComponentProps<"div">) {
	return (
			<div
					data-slot="sheet-header"
					className={cn("flex flex-col gap-0.5 p-4", className)}
					{...props}
			/>
	)
}

function SheetFooter({className, ...props}: React.ComponentProps<"div">) {
	return (
			<div
					data-slot="sheet-footer"
					className={cn("mt-auto flex flex-col gap-2 p-4", className)}
					{...props}
			/>
	)
}

function SheetTitle({
	                    className,
	                    ...props
                    }: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
			<SheetPrimitive.Title
					data-slot="sheet-title"
					className={cn(
							"font-heading text-base font-medium text-foreground",
							className
					)}
					{...props}
			/>
	)
}

function SheetDescription({
	                          className,
	                          ...props
                          }: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
			<SheetPrimitive.Description
					data-slot="sheet-description"
					className={cn("text-sm text-muted-foreground", className)}
					{...props}
			/>
	)
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
}
