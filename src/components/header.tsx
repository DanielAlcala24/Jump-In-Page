"use client";

import Link from "next/link";
import { Zap, LayoutGrid, ShoppingCart, RefreshCw, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#compra", label: "Haz tu Compra" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#eventos", label: "Eventos" },
];

export default function Header() {
  const [navVisible, setNavVisible] = useState(true);

  return (
    <>
      <header className="fixed top-4 left-4 z-50">
         <Link href="#inicio" className="flex items-center gap-2">
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <span className="font-headline text-2xl font-bold text-background drop-shadow-lg">
            JumpZone
          </span>
        </Link>
      </header>

      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center justify-center bg-primary/90 backdrop-blur-sm rounded-full p-2 gap-2 shadow-lg">
          <nav
            className={cn(
              "flex items-center gap-4 transition-all duration-300 ease-in-out",
              navVisible
                ? "opacity-100 max-w-full"
                : "opacity-0 max-w-0"
            )}
          >
            <div className={cn("flex items-center gap-4 overflow-hidden whitespace-nowrap", !navVisible && "px-0")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-primary-foreground transition-colors hover:text-background"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="bg-background/90 text-primary hover:bg-background rounded-full px-4 text-sm h-9">
              <RefreshCw className="mr-2 h-4 w-4"/>
              Recarga
            </Button>
            <Button variant="ghost" className="bg-background/90 text-primary hover:bg-background rounded-full px-4 text-sm h-9">
              <ShoppingCart className="mr-2 h-4 w-4" />
              $0
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setNavVisible(!navVisible)} className="bg-transparent text-primary-foreground hover:bg-primary-foreground/20 rounded-full h-9 w-9">
              {navVisible ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-12">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-2xl font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
    </>
  );
}
