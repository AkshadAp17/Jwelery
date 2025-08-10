import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative hero-pattern py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="font-playfair text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
              Timeless Elegance in{" "}
              <span className="text-gold">Gold</span> &{" "}
              <span className="text-silver">Silver</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover our exquisite collection of handcrafted jewelry, where traditional artistry meets modern design. Each piece tells a story of heritage and luxury.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="gold-gradient text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <i className="fas fa-eye mr-2"></i>
                Explore Collection
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-navy text-navy px-8 py-4 rounded-lg font-semibold hover:bg-navy hover:text-white transition-all duration-300"
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Book Appointment
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Elegant gold jewelry collection"
              className="rounded-2xl shadow-2xl w-full h-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <span className="text-3xl font-bold text-gold">500+</span>
                <p className="text-sm text-gray-600">Unique Designs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
