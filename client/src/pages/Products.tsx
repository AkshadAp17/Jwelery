import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import Footer from "@/components/Footer";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: rates = [] } = useQuery<any[]>({
    queryKey: ["/api/rates"],
  });

  // Filter and sort products
  const filteredProducts = products
    .filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesMaterial = materialFilter === "all" || product.material === materialFilter;
      return matchesSearch && matchesCategory && matchesMaterial;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "weight":
          return parseFloat(b.weight) - parseFloat(a.weight);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const calculatePrice = (product: Product) => {
    const goldRate = rates.find((r: any) => r.material === "gold")?.rate || 9122;
    const silverRate = rates.find((r: any) => r.material === "silver")?.rate || 102;
    
    const baseRate = product.material === "gold" ? goldRate : silverRate;
    const pricePerGram = product.pricePerGram ? parseFloat(product.pricePerGram) : baseRate;
    return parseFloat(product.weight) * pricePerGram;
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "patta-poth", label: "Patta Poth 22K" },
    { value: "necklace", label: "Necklaces" },
    { value: "fancy-poth", label: "Fancy Poth 22K" },
    { value: "choker", label: "Chokers 22K" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-gold mb-4"></i>
          <p className="text-lg">Loading our beautiful collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-playfair font-bold mb-4">
              <i className="fas fa-gem mr-3"></i>
              Complete Jewelry Collection
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover our authentic Mamdej Jewellers catalog featuring traditional designs 
              in premium 22K and 20K gold jewelry
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Products</label>
              <Input
                placeholder="Search jewelry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Material</label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setMaterialFilter("all");
                  setSortBy("name");
                }}
                variant="outline"
                className="w-full"
              >
                <i className="fas fa-undo mr-2"></i>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {(products as Product[]).length} products
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline">
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <div className="flex flex-col space-y-1">
                    {product.featured === 1 && (
                      <Badge variant="secondary" className="bg-gold text-white">
                        Featured
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span className="font-medium">{product.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purity:</span>
                    <span className="font-medium">{product.purity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium capitalize">{product.category.replace('-', ' ')}</span>
                  </div>
                  {product.subcategory && (
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{product.subcategory.replace('-', ' ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span>Price:</span>
                    <span className="font-bold text-gold">
                      ₹{calculatePrice(product).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href={`/product/${product.id}`}>
                    <Button className="w-full gold-gradient text-white">
                      <i className="fas fa-eye mr-2"></i>
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={product.stock === 0}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setMaterialFilter("all");
              }}
              className="gold-gradient text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}