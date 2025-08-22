"use client";

import Link from "next/link";
import { LayoutGrid, X, Menu, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

const navLinks = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#atracciones", label: "Atracciones" },
  { href: "#sucursales", label: "Sucursales" },
  { href: "#fiestas-eventos", label: "Fiestas y eventos empresariales" },
  { href: "#precios-promociones", label: "Precios y promociones" },
  { href: "#registro-digital", label: "Registro digital" },
  { href: "#menu-alimentos", label: "Menú de alimentos" },
  { href: "#galeria", label: "Galería" },
  { href: "#blog", label: "Blog" },
];

const socialLinks = [
    { href: '#', icon: <Facebook className="h-5 w-5"/>, label: 'Facebook' },
    { href: '#', icon: <Instagram className="h-5 w-5"/>, label: 'Instagram' },
    { href: '#', icon: <Twitter className="h-5 w-5"/>, label: 'Twitter' },
  ];

export default function Header() {
  const [navVisible, setNavVisible] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-4 z-50 flex items-center h-11">
         <Link href="#inicio" className="flex items-center gap-2">
          <Image 
            src="/assets/logojumpin.png"
            alt="Jump-in Trampoline Park Logo"
            width={90}
            height={90}
            data-ai-hint="logo jump"
            className="h-auto"
          />
        </Link>
      </header>

      <div className="fixed top-4 right-4 z-50 hidden md:flex">
        <div className={cn("flex backdrop-blur-xl bg-orange-500/70 rounded-3xl shadow-2xl transition-all duration-500 ease-in-out shadow-black/50 flex-col", !navVisible && "w-11 h-11 items-center justify-center", navVisible && "p-2 w-64")}>
          <div className={cn("w-full flex justify-end")}>
            <Button variant="ghost" size="icon" onClick={() => setNavVisible(!navVisible)} className="bg-transparent text-background hover:bg-background/20 rounded-full h-9 w-9 flex-shrink-0">
              {navVisible ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </div>
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4 transition-all duration-300 ease-in-out overflow-hidden w-full",
              !navVisible && "max-h-0 opacity-0", 
              navVisible && "max-h-96 opacity-100 delay-500"
            )}
          >
            <div className={cn("flex flex-col items-center justify-center gap-y-2", navVisible ? "px-4" : "px-0")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-background transition-transform duration-300 ease-in-out hover:scale-110 text-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50 md:hidden">
        <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
                <Button key={social.label} variant="ghost" size="icon" asChild className="rounded-full backdrop-blur-xl bg-orange-500/70 hover:bg-orange-500/40 shadow-2xl text-background w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110 shadow-black/50">
                    <Link href={social.href} aria-label={social.label}>
                        {social.icon}
                    </Link>
                </Button>
            ))}
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="backdrop-blur-xl bg-orange-500/70 rounded-full w-10 h-10 shadow-2xl text-background hover:bg-orange-500/40 transition-transform duration-300 ease-in-out hover:scale-110 shadow-black/50">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-orange-500/70 backdrop-blur-xl border-l-0 p-0">
                  <ScrollArea className="h-full w-full">
                    <div className="flex flex-col gap-6 p-6 pt-12 h-full">
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
                                <Link
                                href={link.href}
                                className="text-sm font-medium text-background transition-transform duration-300 ease-in-out hover:scale-110"
                                >
                                {link.label}
                                </Link>
                            </SheetClose>
                            ))}
                        </div>
                        <Separator className="my-4 bg-background/20"/>
                        <div className="flex flex-col gap-4">
                            <p className="text-background/80">Síguenos</p>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <Button key={social.label} variant="ghost" size="icon" asChild className="rounded-full bg-white/20 text-white transition-transform duration-300 ease-in-out hover:scale-110">
                                    <Link href={social.href} aria-label={social.label}>
                                        {social.icon}
                                    </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
        </div>
    </>
  );
}
