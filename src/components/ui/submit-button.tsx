"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({ children, pendingLabel = "Salvando...", ...props }: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || props.disabled} type="submit" {...props}>
      {pending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
