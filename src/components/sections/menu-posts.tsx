'use client';
import Image from 'next/image';

const menuItems = [
  {
    title: 'Pizza de Pepperoni',
    description: 'Clásica y deliciosa, con extra queso y pepperoni de primera.',
    price: '$180.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=1',
    imageHint: 'pepperoni pizza',
  },
  {
    title: 'Hamburguesa Jump-In',
    description:
      'Jugosa carne de res, queso cheddar, tocino crujiente y nuestros aderezos secretos.',
    price: '$150.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=2',
    imageHint: 'classic burger',
  },
  {
    title: 'Hot Dog Especial',
    description: 'Salchicha jumbo, pan artesanal y tus toppings favoritos.',
    price: '$90.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=3',
    imageHint: 'special hotdog',
  },
  {
    title: 'Nuggets de Pollo',
    description:
      'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
    price: '$120.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=4',
    imageHint: 'chicken nuggets',
  },
  {
    title: 'Malteada de Chocolate',
    description:
      'Cremosa y refrescante, el postre perfecto después de tanto saltar.',
    price: '$70.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=5',
    imageHint: 'chocolate milkshake',
  },
  {
    title: 'Refresco de Sabores',
    description:
      'La bebida ideal para recargar energías y seguir la diversión.',
    price: '$40.00 MXN',
    imageSrc: 'https://picsum.photos/400/400?random=6',
    imageHint: 'soda drink',
  },
];

export default function MenuPosts() {
  return (
    <section id="menu" className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950 text-center p-6"
            >
              <div className="relative w-40 h-40 mb-4 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={400}
                  height={400}
                  data-ai-hint={item.imageHint}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                  {item.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                <div className="mt-auto">
                    <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-base text-primary font-headline">
                        {item.price}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
