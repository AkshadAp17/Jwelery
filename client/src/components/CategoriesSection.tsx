import { Link } from "wouter";

export default function CategoriesSection() {
  const categories = [
    {
      name: "Patta Poth 22K",
      path: "/patta-poth",
      description: "Traditional Patta Poth Chains",
      count: "78+ Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2XivMO9ndCXNbm.jpg",
      subcategories: ["Long Poth", "Short Poth"]
    },
    {
      name: "Necklaces",
      path: "/necklace",
      description: "20K & 22K Gold Collections",
      count: "556+ Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQbGrKDYWOMt4I1P3_D.jpg",
      subcategories: ["Temple 22K", "Fancy 22K", "Classic 22K", "Fancy 20K", "Classic 20K", "Arbi 20K"]
    },
    {
      name: "Fancy Poth 22K",
      path: "/fancy-poth",
      description: "Premium Fancy Poth Collection",
      count: "211+ Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OPf3ddUzrqvAEstCTE7.jpg",
      subcategories: ["With Pendant", "Cartier Style", "Nano Poth", "Short Poth", "Long Poth"]
    },
    {
      name: "Chokers 22K",
      path: "/choker",
      description: "Elegant Choker Designs",
      count: "13+ Designs",
      image: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSTu3vTuwmExEYADJ5v.jpg",
      subcategories: ["Temple Choker", "Yellow Choker"]
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.path} href={category.path}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={category.image}
                    alt={`${category.name} Collection`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="font-playfair text-2xl font-bold mb-2">{category.name}</h4>
                    <p className="text-sm opacity-90">{category.description}</p>
                    <span className="inline-block mt-2 text-xs bg-gold px-3 py-1 rounded-full">
                      {category.count}
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
