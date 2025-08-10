import { Link } from "wouter";

export default function CategoriesSection() {
  // 8 distinct collections based on our authentic Mamdej Jewellers catalog
  const collections = [
    {
      name: "Patta Long Poth 22K",
      path: "/category/patta-poth/long",
      description: "Traditional long patta poth chains",
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2XivMO9ndCXNbm.jpg"
    },
    {
      name: "Patta Short Poth 22K", 
      path: "/category/patta-poth/short",
      description: "Elegant short patta poth for daily wear",
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OV32_LA01WVd3tBQeGh.jpg"
    },
    {
      name: "Fancy Necklace 20K",
      path: "/category/necklace/fancy-20k", 
      description: "Beautiful fancy designs in 20K gold",
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWBDQnKvRuKIs0Etcej.jpg"
    },
    {
      name: "Temple Necklace 22K",
      path: "/category/necklace/temple-22k",
      description: "Sacred temple design necklaces", 
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQbGrKDYWOMt4I1P3_D.jpg"
    },
    {
      name: "Fancy Necklace 22K",
      path: "/category/necklace/fancy-22k",
      description: "Luxurious fancy designs in 22K gold",
      count: "Authentic Designs", 
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUyR7FLxj9OG89qpI94.jpg"
    },
    {
      name: "Fancy Poth With Pendant",
      path: "/category/fancy-poth/with-pendant",
      description: "Beautiful fancy poth with matching pendant",
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OPf3ddUzrqvAEstCTE7.jpg"
    },
    {
      name: "Cartier Poth 22K",
      path: "/category/fancy-poth/cartier", 
      description: "Luxurious Cartier style poth design",
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMb7WhA0ZOs6XLtn3sG.jpg"
    },
    {
      name: "Temple Choker 22K",
      path: "/category/choker/temple",
      description: "Sacred temple design choker necklace", 
      count: "Authentic Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSTu3vTuwmExEYADJ5v.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-playfair text-4xl font-bold text-navy mb-4">Our Collections</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our carefully curated categories, each featuring unique designs crafted with precision and love.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Link key={collection.path} href={collection.path}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={collection.image}
                    alt={`${collection.name} Collection`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-playfair text-lg font-bold mb-1">{collection.name}</h4>
                    <p className="text-xs opacity-90">{collection.description}</p>
                    <span className="inline-block mt-1 text-xs bg-gold px-2 py-1 rounded-full">
                      {collection.count}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
