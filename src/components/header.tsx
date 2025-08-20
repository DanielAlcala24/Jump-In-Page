"use client";

import Link from "next/link";
import { LayoutGrid, X, Menu, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import Image from "next/image";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#compra", label: "Haz tu Compra" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#eventos", label: "Eventos" },
];

const socialLinks = [
    { href: '#', icon: <Facebook className="h-5 w-5"/>, label: 'Facebook' },
    { href: '#', icon: <Instagram className="h-5 w-5"/>, label: 'Instagram' },
    { href: '#', icon: <Twitter className="h-5 w-5"/>, label: 'Twitter' },
  ];

export default function Header() {
  const [navVisible, setNavVisible] = useState(true);

  return (
    <>
      <header className="fixed top-4 left-4 z-50">
         <Link href="#inicio" className="flex items-center gap-2">
          <Image 
            src="https://placehold.co/120x90.png"
            alt="Jump-in Trampoline Park Logo"
            width={120}
            height={90}
            data-ai-hint="logo jump"
          />
        </Link>
      </header>

      <div className="fixed top-4 right-4 z-50 hidden md:flex">
        <div className={cn("flex items-center justify-center bg-primary/90 backdrop-blur-sm rounded-full p-2 gap-2 shadow-lg transition-all duration-300 ease-in-out", !navVisible && "p-0")}>
          <nav
            className={cn(
              "flex items-center gap-4 transition-all duration-300 ease-in-out overflow-hidden",
              navVisible
                ? "opacity-100 max-w-xl"
                : "opacity-0 max-w-0"
            )}
          >
            <div className={cn("flex items-center gap-4 whitespace-nowrap", navVisible ? "px-4" : "px-0")}>
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
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setNavVisible(!navVisible)} className="bg-transparent text-primary-foreground hover:bg-primary-foreground/20 rounded-full h-9 w-9 flex-shrink-0">
              {navVisible ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50 md:hidden">
        <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
                <Button key={social.label} variant="ghost" size="icon" asChild className="rounded-full bg-background/80 backdrop-blur-sm text-foreground w-10 h-10">
                    <Link href={social.href} aria-label={social.label}>
                        {social.icon}
                    </Link>
                </Button>
            ))}
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm rounded-full w-10 h-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                <div className="flex flex-col gap-6 pt-12 h-full">
                    <div className="flex flex-col gap-6">
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
                    <Separator className="my-4"/>
                    <div className="flex flex-col gap-4">
                        <p className="text-muted-foreground">Síguenos</p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <Button key={social.label} variant="outline" size="icon" asChild className="rounded-full bg-background/50 backdrop-blur-sm">
                                <Link href={social.href} aria-label={social.label}>
                                    {social.icon}
                                </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                </SheetContent>
            </Sheet>
        </div>
        </div>
    </>
  );
}
