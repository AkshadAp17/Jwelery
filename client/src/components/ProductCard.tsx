import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getBadgeColor = () => {
    if (product.featured === 1) return "bg-gold text-white";
    if (product.material === "gold") return "bg-amber-100 text-amber-800";
    if (product.material === "silver") return "bg-gray-100 text-gray-800";
    return "bg-blue-100 text-blue-800";
  };

  const getButtonClass = () => {
    return product.material === "gold" ? "gold-gradient" : "silver-gradient";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {product.featured === 1 ? (
            <Badge className={getBadgeColor()}>Featured</Badge>
          ) : (
            <Badge variant="secondary" className={getBadgeColor()}>
              {product.material === "gold" ? "Gold" : "Silver"}
            </Badge>
          )}
        </div>
        <button className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>
      
      <div className="p-6">
        <h4 className="font-semibold text-lg text-navy mb-2 line-clamp-1">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-gold">{product.weight}g</span>
          <span className="text-sm text-gray-500">{product.purity}</span>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button 
              className={`${getButtonClass()} text-white w-full py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300`}
            >
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            className="w-10 h-10 p-0 border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
