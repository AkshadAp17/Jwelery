import { Link } from "wouter";

export default function CategoriesSection() {
  const categories = [
    {
      name: "Necklaces",
      path: "/necklaces",
      description: "Traditional & Contemporary",
      count: "50+ Designs",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      subcategories: ["Chain Necklaces", "Pendant Sets", "Chokers", "Long Chains"]
    },
    {
      name: "Haras",
      path: "/haras",
      description: "Royal Heritage Collection",
      count: "25+ Designs",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      subcategories: ["Kundan Haras", "Temple Haras", "Polki Haras", "Antique Haras"]
    },
    {
      name: "Mangalsutra",
      path: "/mangalsutra",
      description: "Sacred & Beautiful",
      count: "30+ Designs",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      subcategories: ["Andhra Style", "Maharashtrian Style", "Rajasthani Style", "Modern Style"]
    },
    {
      name: "Rings",
      path: "/rings",
      description: "Engagement & Wedding",
      count: "75+ Designs",
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      subcategories: ["Wedding Rings", "Engagement Rings", "Daily Wear", "Statement Rings"]
    },
    {
      name: "Earrings",
      path: "/earrings",
      description: "Studs & Chandeliers",
      count: "60+ Designs",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      subcategories: ["Jhumkas", "Chandbali", "Studs", "Hoops", "Chandelier"]
    },
    {
      name: "Silver Items",
      path: "/silver",
      description: "Puja & Gifting Items",
      count: "40+ Items",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      subcategories: ["Silver Plates", "Deepak/Diyas", "Glasses", "God Structures", "Gift Sets"]
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
