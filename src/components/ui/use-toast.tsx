/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ui/use-toast.tsx
"use client"

import React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = ToastPrimitive.Viewport;
const ToastRoot = ToastPrimitive.Root;
const ToastAction = ToastPrimitive.Action;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-white text-slate-950",
        destructive: "group destructive border-red-500 bg-red-500 text-white",
        success: "border-green-500 bg-green-500 text-white",
        warning: "border-yellow-500 bg-yellow-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastRoot>,
    VariantProps<typeof toastVariants> {}

const Toast = React.forwardRef<React.ElementRef<typeof ToastRoot>, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <ToastRoot
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = ToastRoot.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50",
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

// Custom hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = React.useState<
    Array<ToastProps & { id: string }>
  >([]);

  const toast = React.useCallback(
    ({
      variant = "default",
      title,
      description,
      duration = 3000,
    }: {
      variant?: ToastProps["variant"];
      title?: string;
      description?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          variant,
          children: (
            <div className="w-full">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
          ),
        },
      ]);

      if (duration !== Infinity) {
        setTimeout(() => {
          setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
          );
        }, duration);
      }

      return { id };
    },
    []
  );

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Composant Toaster global
export function Toaster(p0: { title: string; description: string; variant: string; }) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast}>
          {toast.children}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-0 right-0 z-[100] flex flex-col p-4 gap-2 w-[390px] max-w-[100vw]" />
    </ToastProvider>
  );
}

// Exemple d'utilisation dans un composant
export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          toast({
            title: "Succès",
            description: "Action réalisée avec succès",
            variant: "success",
          })
        }
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Toast Succès
      </button>
      <button
        onClick={() =>
          toast({
            title: "Erreur",
            description: "Une erreur est survenue",
            variant: "destructive",
          })
        }
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toast Erreur
      </button>
    </div>
  );
}
