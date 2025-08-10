import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-playfair text-4xl font-bold text-navy mb-4">Visit Our Store</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience our collection in person and get expert guidance from our knowledgeable staff.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="font-playfair text-2xl font-bold text-navy mb-6">Get in Touch</h4>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-gold text-lg" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-navy mb-1">Address</h5>
                    <p className="text-gray-600">123 Market Street, Jewelry District<br />Mumbai, Maharashtra 400001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-gold text-lg" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-navy mb-1">Phone</h5>
                    <p className="text-gray-600">+91 98765 43210<br />+91 98765 43211</p>
                    <a 
                      href="tel:+919876543210"
                      className="text-gold hover:text-yellow-600 text-sm font-medium mt-1 inline-flex items-center"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Click to Call
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-gold text-lg" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-navy mb-1">Business Hours</h5>
                    <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM<br />Sunday: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-gold text-lg" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-navy mb-1">Email</h5>
                    <p className="text-gray-600">info@shreejewellers.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
                  <p className="text-gray-600 font-semibold">Interactive Map</p>
                  <p className="text-sm text-gray-500">Google Maps Integration</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-navy">Shree Jewellers</h5>
                    <p className="text-gray-600 text-sm">Jewelry District, Mumbai</p>
                  </div>
                  <Button className="gold-gradient text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
