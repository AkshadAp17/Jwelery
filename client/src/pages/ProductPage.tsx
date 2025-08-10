import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import RatesDisplay from "@/components/RatesDisplay";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import CallButton from "@/components/CallButton";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, Share2, Phone } from "lucide-react";
import { Link } from "wouter";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream text-charcoal">
        <Header />
        <RatesDisplay />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="w-full h-96 rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream text-charcoal">
        <Header />
        <RatesDisplay />
        
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-navy mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <Header />
      <RatesDisplay />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-gold hover:text-yellow-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              {product.featured === 1 && (
                <Badge className="absolute top-4 left-4 bg-gold text-white">
                  Featured
                </Badge>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-playfair text-4xl font-bold text-navy mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">
                      {product.weight}g
                    </div>
                    <div className="text-sm text-gray-600">Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-navy mb-2">
                      {product.purity}
                    </div>
                    <div className="text-sm text-gray-600">Purity</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-navy">Material:</span>
                  <Badge variant="outline" className="capitalize">
                    {product.material}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-navy">Category:</span>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 gold-gradient text-white hover:shadow-lg transition-all duration-300">
                  Get Quote
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href="tel:+919876543210">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-navy mb-2">
                  <i className="fas fa-info-circle text-amber-500 mr-2"></i>
                  Important Note
                </h3>
                <p className="text-sm text-gray-700">
                  Final pricing is based on current gold/silver rates and the exact weight of the jewelry. 
                  Please visit our store or call us for accurate pricing and availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <CallButton />
    </div>
  );
}
