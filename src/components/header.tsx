
"use client";

import Link from "next/link";
import { LayoutGrid, X, Menu, Search, Facebook, Youtube, Instagram, HelpCircle, FileText, Utensils, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { searchContent, SearchResult } from "@/lib/search";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/compromiso-social", label: "Compromiso Social" },
  { href: "/fiestas-y-eventos", label: "Fiestas y eventos empresariales" },
  { href: "/atracciones", label: "Atracciones" },
  { href: "/sucursales", label: "Sucursales" },
  { href: "/precios-y-promociones", label: "Precios y promociones" },
  { href: "http://decmanager.com:140", label: "Registro digital", external: true },
  { href: "/menu-alimentos", label: "Menú de alimentos" },
  { href: "/galeria", label: "Galería" },
  { href: "/blog", label: "Blog" },
  { href: "/facturacion", label: "Facturación" },
];

const getResultIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'faq':
      return <HelpCircle className="h-4 w-4" />
    case 'blog':
      return <FileText className="h-4 w-4" />
    case 'menu':
      return <Utensils className="h-4 w-4" />
    case 'section':
      return <Hash className="h-4 w-4" />
    default:
      return <Search className="h-4 w-4" />
  }
}

const getResultTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'faq':
      return 'Pregunta Frecuente'
    case 'blog':
      return 'Artículo del Blog'
    case 'menu':
      return 'Menú'
    case 'section':
      return 'Sección'
    case 'page':
      return 'Página'
    default:
      return 'Resultado'
  }
}

export default function Header() {
  const [navVisible, setNavVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchContent(searchTerm);
        setSuggestions(results);
      } catch (error) {
        console.error('Error searching:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce para evitar demasiadas búsquedas
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (!isSheetOpen && searchInputRef.current) {
        searchInputRef.current.blur();
    }
  }, [isSheetOpen]);

  const handleSuggestionClick = (result: SearchResult) => {
    setSearchTerm('');
    setSuggestions([]);
    setIsSheetOpen(false);

    // Construir la URL con hash si hay sectionId
    let url = result.href;
    if (result.sectionId && !url.includes('#')) {
      url = `${url}#${result.sectionId}`;
    }

    // Si es una sección en la misma página, hacer scroll suave
    if (result.sectionId && (url.startsWith('/#') || url === `/#${result.sectionId}`)) {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(result.sectionId!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Navegar a la página
      router.push(url);
    }
  };

  return (
    <>
      <header className="fixed top-4 left-4 z-50 flex items-center h-10">
         <Link href="/" className="flex items-center gap-2">
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
                  ref={searchInputRef}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-background/70" />
                {(suggestions.length > 0 || isSearching) && (
                  <div className="absolute top-full mt-2 w-full rounded-md bg-white/95 backdrop-blur-sm shadow-lg max-h-80 overflow-y-auto z-50 border border-gray-200">
                    {isSearching ? (
                      <div className="px-4 py-3 text-sm text-gray-600 text-center">
                        Buscando...
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.map((result, index) => (
                          <button
                            key={`${result.type}-${result.href}-${index}`}
                            onClick={() => handleSuggestionClick(result)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 text-gray-500 flex-shrink-0">
                                {getResultIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-500 uppercase">
                                    {getResultTypeLabel(result.type)}
                                  </span>
                                </div>
                                <div className="font-medium text-gray-900 text-sm mb-1">
                                  {result.title}
                                </div>
                                {result.description && (
                                  <div className="text-xs text-gray-600 line-clamp-2">
                                    {result.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-600 text-center">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
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
                <SheetContent side="right" className="bg-orange-500/70 backdrop-blur-xl border-l-0 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                  <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navega por las diferentes secciones del sitio web de Jump-In.
                  </SheetDescription>
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
                             {(suggestions.length > 0 || isSearching) && (
                                <div className="absolute top-full mt-2 w-full rounded-md bg-white/95 backdrop-blur-sm shadow-lg max-h-80 overflow-y-auto z-50 border border-gray-200">
                                    {isSearching ? (
                                      <div className="px-4 py-3 text-sm text-gray-600 text-center">
                                        Buscando...
                                      </div>
                                    ) : suggestions.length > 0 ? (
                                      <>
                                        {suggestions.map((result, index) => (
                                          <button
                                            key={`${result.type}-${result.href}-${index}`}
                                            onClick={() => handleSuggestionClick(result)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className="mt-0.5 text-gray-500 flex-shrink-0">
                                                {getResultIcon(result.type)}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="text-xs font-medium text-gray-500 uppercase">
                                                    {getResultTypeLabel(result.type)}
                                                  </span>
                                                </div>
                                                <div className="font-medium text-gray-900 text-sm mb-1">
                                                  {result.title}
                                                </div>
                                                {result.description && (
                                                  <div className="text-xs text-gray-600 line-clamp-2">
                                                    {result.description}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </button>
                                        ))}
                                      </>
                                    ) : (
                                      <div className="px-4 py-3 text-sm text-gray-600 text-center">
                                        No se encontraron resultados
                                      </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
                                <Link
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className="text-sm font-medium text-background transition-transform duration-300 ease-in-out hover:scale-110"
                                >
                                {link.label}
                                </Link>
                            </SheetClose>
                            ))}
                        </div>
                        <Separator className="my-4 bg-background/20"/>
                        <div className="flex justify-center gap-4">
                            <Link href="https://www.tiktok.com/@jumpin_mx" aria-label="TikTok" className="text-background hover:text-white transition-colors">
                                <Image src="/assets/svg/tiktok.png" alt="TikTok" width={24} height={24} className="h-6 w-6" />
                            </Link>
                            <Link href="https://www.instagram.com/jumpin_mx" aria-label="Instagram" className="text-background hover:text-white transition-colors"><Instagram className="h-6 w-6"/></Link>
                            <Link href="https://www.facebook.com/JumpInMX/?locale=es_LA" aria-label="Facebook" className="text-background hover:text-white transition-colors"><Facebook className="h-6 w-6"/></Link>
                            <Link href="https://www.youtube.com/channel/UCQ0A6bqmDR1EThKl1o0l1Zg" aria-label="YouTube" className="text-background hover:text-white transition-colors"><Youtube className="h-6 w-6"/></Link>
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
