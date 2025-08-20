"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InfoBar() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative z-50 bg-primary text-primary-foreground">
      <div className="container mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-center text-sm font-medium">
        <Megaphone className="h-4 w-4 flex-shrink-0" />
        <span>
          Horario de apertura: Lunes a Domingo de 10am - 10pm. ¡Alerta especial! 50% de descuento los miércoles.
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
