import { createServerComponentClient } from '@/lib/supabase-server';
import TopBanner, { DEFAULT_DESKTOP_MAX_HEIGHT } from './top-banner';

/** Breakpoint `md` de Tailwind: a partir de aquí se usa la imagen de PC */
const DESKTOP_BREAKPOINT = '768px';

interface BannerConfig {
  is_active: boolean;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  mobile_image_url: string | null;
  mobile_image_width: number | null;
  mobile_image_height: number | null;
  desktop_max_height: number | null;
  image_alt: string | null;
  link_url: string | null;
  is_dismissible: boolean;
  updated_at: string;
}

const fullWidthHeight = (width: number | null, height: number | null) =>
  width && height ? `calc(100vw * ${(height / width).toFixed(6)})` : null;

/**
 * CSS que reserva la altura del banner desde el primer render (antes de que corra
 * el JS), para que el header flotante no se encime con la imagen.
 */
function buildHeightHint(banner: BannerConfig): string | null {
  const hasDesktop = !!banner.image_url;
  const hasMobile = !!banner.mobile_image_url;

  const desktopHeight = fullWidthHeight(banner.image_width, banner.image_height);
  const mobileHeight = fullWidthHeight(banner.mobile_image_width, banner.mobile_image_height);

  let small: string | null = null;
  let large: string | null = null;

  if (hasDesktop && hasMobile) {
    small = mobileHeight;
    large = desktopHeight;
  } else if (hasDesktop) {
    small = desktopHeight;
  } else if (hasMobile) {
    small = mobileHeight;
    // En PC la imagen de móvil se limita a un alto máximo y se centra
    if (banner.mobile_image_height) {
      const maxHeight = banner.desktop_max_height || DEFAULT_DESKTOP_MAX_HEIGHT;
      large = `${Math.min(banner.mobile_image_height, maxHeight)}px`;
    }
  }

  const rules = [
    small && `:root{--banner-h:${small}}`,
    large && `@media(min-width:${DESKTOP_BREAKPOINT}){:root{--banner-h:${large}}}`,
  ].filter(Boolean);

  return rules.length > 0 ? rules.join('') : null;
}

export default async function TopBannerServer() {
  let banner: BannerConfig | null = null;

  // Fuera del try: si Next necesita marcar la página como dinámica (usa cookies),
  // ese error debe propagarse en lugar de silenciarse.
  const supabase = await createServerComponentClient();

  try {
    const { data, error } = await supabase
      .from('banner_config')
      .select(
        'is_active, image_url, image_width, image_height, mobile_image_url, mobile_image_width, mobile_image_height, desktop_max_height, image_alt, link_url, is_dismissible, updated_at'
      )
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error cargando el banner:', error.message);
      return null;
    }

    banner = (data?.[0] as BannerConfig) || null;
  } catch (err) {
    // Si la tabla todavía no existe o Supabase falla, el sitio sigue funcionando sin banner
    console.error('Error cargando el banner:', err);
    return null;
  }

  if (!banner?.image_url && !banner?.mobile_image_url) return null;

  const heightHint = buildHeightHint(banner);

  return (
    <>
      {heightHint && <style dangerouslySetInnerHTML={{ __html: heightHint }} />}
      <TopBanner
        desktopImageUrl={banner.image_url}
        mobileImageUrl={banner.mobile_image_url}
        imageAlt={banner.image_alt}
        linkUrl={banner.link_url}
        isDismissible={banner.is_dismissible}
        desktopMaxHeight={banner.desktop_max_height}
        version={banner.updated_at}
      />
    </>
  );
}
