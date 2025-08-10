import { Link } from "wouter";

export default function Footer() {
  const collections = [
    { name: "Patta Poth 22K", path: "/category/patta-poth", key: "patta-poth" },
    { name: "Necklaces 20K", path: "/category/necklace?filter=20k", key: "necklace-20k" },
    { name: "Necklaces 22K", path: "/category/necklace?filter=22k", key: "necklace-22k" },
    { name: "Fancy Poth 22K", path: "/category/fancy-poth", key: "fancy-poth" },
    { name: "Chokers 22K", path: "/category/choker", key: "choker" },
    { name: "View All Products", path: "/products", key: "all-products" },
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
                <li key={collection.key}>
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
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-tools mr-2"></i>Custom Jewelry</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-wrench mr-2"></i>Repair Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-certificate mr-2"></i>Jewelry Appraisal</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-exchange-alt mr-2"></i>Gold Exchange</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-sparkles mr-2"></i>Cleaning Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-comments mr-2"></i>Consultation</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="/admin" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-user-shield mr-2"></i>Admin Panel</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-info-circle mr-2"></i>About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-phone mr-2"></i>Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-shield-alt mr-2"></i>Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-file-contract mr-2"></i>Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors flex items-center"><i className="fas fa-award mr-2"></i>Warranty</a></li>
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

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <h5 className="font-semibold text-lg mb-4 text-gold">Visit Our Store</h5>
            <p className="text-gray-300 mb-2">
              <i className="fas fa-map-marker-alt mr-2"></i>
              123 Jewelry Street, Gold Market
            </p>
            <p className="text-gray-300 mb-2">
              <i className="fas fa-phone mr-2"></i>
              +91 98765 43210
            </p>
            <p className="text-gray-300">
              <i className="fas fa-clock mr-2"></i>
              Mon-Sat: 10 AM - 8 PM
            </p>
          </div>
          
          <div className="text-center">
            <h5 className="font-semibold text-lg mb-4 text-gold">Book Appointment</h5>
            <p className="text-gray-300 mb-4">Schedule a personal consultation with our jewelry experts</p>
            <button className="gold-gradient text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform">
              <i className="fas fa-calendar-alt mr-2"></i>
              Book Now
            </button>
          </div>
          
          <div className="text-center">
            <h5 className="font-semibold text-lg mb-4 text-gold">Explore Collection</h5>
            <p className="text-gray-300 mb-4">Browse our complete jewelry catalog with authentic Mamdej designs</p>
            <Link href="/products">
              <button className="border border-gold text-gold px-6 py-2 rounded-lg hover:bg-gold hover:text-white transition-colors">
                <i className="fas fa-search mr-2"></i>
                View Catalog
              </button>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
          <p>&copy; 2024 Shree Jewellers. All rights reserved. | Authentic Mamdej Jewellers Collection</p>
        </div>
      </div>
    </footer>
  );
}
