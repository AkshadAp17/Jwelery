import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Filter, Grid, List } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const categorySubcategories: Record<string, string[]> = {
  "patta-poth": ["long", "short"],
  "necklace": ["temple-22k", "fancy-22k", "classic-22k", "fancy-20k", "classic-20k", "arbi-20k"],
  "fancy-poth": ["with-pendant", "cartier", "nano", "short", "long"],
  "choker": ["temple", "yellow"],
};

const categoryNames: Record<string, string> = {
  "patta-poth": "Patta Poth 22K",
  "necklace": "Necklaces",
  "fancy-poth": "Fancy Poth 22K",
  "choker": "Chokers 22K",
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t } = useLanguage();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [materialFilter, setMaterialFilter] = useState<"all" | "gold" | "silver">("all");

  // Fetch products for category
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products/category", category],
    enabled: !!category && !selectedSubcategory,
  });

  // Fetch products for subcategory  
  const { data: subcategoryProducts = [], isLoading: isSubcategoryLoading } = useQuery({
    queryKey: ["/api/products/category", category, selectedSubcategory],
    enabled: !!category && !!selectedSubcategory,
  });

  const currentProducts: any[] = selectedSubcategory ? subcategoryProducts : products;
  const filteredProducts = materialFilter === "all" 
    ? currentProducts 
    : currentProducts.filter((p: any) => p.material === materialFilter);

  const subcategories = category ? categorySubcategories[category] || [] : [];
  const categoryName = category ? categoryNames[category] || category : "";

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory("");
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  if (isLoading || isSubcategoryLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-navy capitalize">{categoryName}</span>
          {selectedSubcategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-gold">{selectedSubcategory}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-navy mb-4 capitalize">
            {selectedSubcategory || categoryName}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {selectedSubcategory 
              ? `Discover our exquisite ${selectedSubcategory} collection` 
              : `Explore our beautiful ${categoryName} collection with traditional and contemporary designs`
            }
          </p>
        </div>

        {/* Subcategory Filter */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-navy mb-4">Browse by Style:</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={!selectedSubcategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubcategory("")}
                className={!selectedSubcategory ? "gold-gradient text-white" : ""}
              >
                All {categoryName}
              </Button>
              {subcategories.map((sub) => (
                <Button
                  key={sub}
                  variant={selectedSubcategory === sub ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSubcategoryClick(sub)}
                  className={selectedSubcategory === sub ? "gold-gradient text-white" : ""}
                >
                  {sub}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Material:</span>
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Materials</option>
                <option value="gold">Gold Only</option>
                <option value="silver">Silver Only</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
            <div className="flex border border-gray-300 rounded">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-none ${viewMode === "grid" ? "bg-gold text-white" : ""}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none ${viewMode === "list" ? "bg-gold text-white" : ""}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 mb-16 ${
            viewMode === "grid" 
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 md:grid-cols-2"
          }`}>
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or browse other categories
            </p>
            <Button 
              onClick={() => {
                setSelectedSubcategory("");
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