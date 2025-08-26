"use client";

import Link from "next/link";
import { LayoutGrid, X, Menu, Search, Facebook, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

const navLinks = [
  { href: "#introduccion", label: "Nosotros" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas Frecuentes" },
  { href: "#eventos", label: "Fiestas y eventos" },
  { href: "#atracciones", label: "Atracciones" },
  { href: "#sucursales", label: "Sucursales" },
  { href: "#precios-promociones", label: "Precios y promociones" },
  { href: "#registro-digital", label: "Registro digital" },
  { href: "#menu-alimentos", label: "Menú de alimentos" },
  { href: "#galeria", label: "Galería" },
  { href: "#blog", label: "Blog" },
];

export default function Header() {
  const [navVisible, setNavVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<typeof navLinks>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const filtered = navLinks.filter(link =>
        link.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setSearchTerm('');
    setSuggestions([]);
    setIsSheetOpen(false); 
  };

  return (
    <>
      <header className="fixed top-4 left-4 z-50 flex items-center h-10">
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
        <div className={cn("flex backdrop-blur-xl bg-orange-500/70 rounded-3xl shadow-2xl transition-all duration-500 ease-in-out shadow-black/50 flex-col", !navVisible && "w-10 h-10 items-center justify-center", navVisible && "p-2 w-64")}>
          <div className={cn("w-full flex", navVisible ? 'justify-end' : 'justify-center')}>
            <Button variant="ghost" size="icon" onClick={() => setNavVisible(!navVisible)} className="bg-transparent text-background hover:bg-background/20 rounded-full h-10 w-10 flex-shrink-0">
              {navVisible ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </div>
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4 transition-all duration-300 ease-in-out overflow-hidden w-full",
              !navVisible && "max-h-0 opacity-0", 
              navVisible && "max-h-[500px] opacity-100 delay-500"
            )}
          >
            <div className={cn("flex flex-col items-center justify-center gap-y-2 pb-4", navVisible ? "px-4" : "px-0")}>
              <div className="relative w-full mb-4">
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="w-full pl-10 bg-background/20 border-background/30 text-background placeholder:text-background/70 rounded-full focus-visible:ring-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-background/70" />
                {suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full rounded-md bg-white/90 backdrop-blur-sm shadow-lg max-h-60 overflow-y-auto z-10">
                    {suggestions.map((link) => (
                      <a
                        key={link.href}
                        onClick={() => handleSuggestionClick(link.href)}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer text-center"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="backdrop-blur-xl bg-orange-500/70 rounded-full w-10 h-10 shadow-2xl text-background hover:bg-orange-500/40 transition-transform duration-300 ease-in-out hover:scale-110 shadow-black/50">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-orange-500/70 backdrop-blur-xl border-l-0 p-0">
                  <ScrollArea className="h-full w-full">
                    <div className="flex flex-col gap-6 p-6 pt-12 h-full">
                        <div className="relative w-full mb-4">
                            <Input
                            type="search"
                            placeholder="Buscar..."
                            className="w-full pl-10 bg-background/20 border-background/30 text-background placeholder:text-background/70 rounded-full focus-visible:ring-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-background/70" />
                             {suggestions.length > 0 && (
                                <div className="absolute top-full mt-2 w-full rounded-md bg-white/90 backdrop-blur-sm shadow-lg max-h-60 overflow-y-auto z-20">
                                    {suggestions.map((link) => (
                                    <a
                                        key={link.href}
                                        onClick={() => handleSuggestionClick(link.href)}
                                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {link.label}
                                    </a>
                                    ))}
                                </div>
                            )}
                        </div>
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
                        <div className="flex justify-center gap-4">
                            <Link href="#" aria-label="TikTok" className="text-background hover:text-white transition-colors">
                                <Image src="/assets/svg/tiktok.png" alt="TikTok" width={24} height={24} className="h-6 w-6" />
                            </Link>
                            <Link href="#" aria-label="Instagram" className="text-background hover:text-white transition-colors"><Instagram className="h-6 w-6"/></Link>
                            <Link href="#" aria-label="Facebook" className="text-background hover:text-white transition-colors"><Facebook className="h-6 w-6"/></Link>
                            <Link href="#" aria-label="YouTube" className="text-background hover:text-white transition-colors"><Youtube className="h-6 w-6"/></Link>
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
