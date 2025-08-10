import { Link } from "wouter";

export default function Footer() {
  const collections = [
    { name: "Necklaces", path: "/necklaces" },
    { name: "Haras", path: "/haras" },
    { name: "Mangalsutra", path: "/mangalsutra" },
    { name: "Rings", path: "/rings" },
    { name: "Earrings", path: "/earrings" },
    { name: "Bracelets", path: "/bracelets" },
  ];

  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-playfair text-2xl font-bold mb-4">
              <i className="fas fa-gem text-gold mr-2"></i>
              Shree Jewellers
            </h4>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Crafting timeless jewelry with passion and precision for over 25 years. Your trusted partner for life's precious moments.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gold bg-opacity-20 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gold bg-opacity-20 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gold bg-opacity-20 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Collections</h5>
            <ul className="space-y-2">
              {collections.map((collection) => (
                <li key={collection.path}>
                  <Link href={collection.path}>
                    <button className="text-gray-300 hover:text-gold transition-colors text-left">
                      {collection.name}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Services</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Custom Jewelry</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Repair Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Jewelry Appraisal</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Gold Exchange</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Cleaning Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Consultation</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Warranty</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 Shree Jewellers. All rights reserved. | Designed with ❤️ for our valued customers.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>Certified by:</span>
              <span className="bg-gold bg-opacity-20 px-3 py-1 rounded-full text-gold font-medium">BIS Hallmark</span>
              <span className="bg-silver bg-opacity-20 px-3 py-1 rounded-full text-silver font-medium">GST Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
