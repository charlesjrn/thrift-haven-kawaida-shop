
import { Link } from "react-router-dom";
import { ShoppingBag, MessageCircle, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">
                THE FASHIONISTA YARD
                <span className="text-orange-500">KE</span>
              </span>
            </div>
            <p className="text-gray-400">
              Your go-to destination for quality thrift fashion in Kenya. Affordable style, sustainable choices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-to-order" className="text-gray-400 hover:text-white transition-colors">How to Order</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/shop?category=men" className="text-gray-400 hover:text-white transition-colors">Men's Fashion</Link></li>
              <li><Link to="/shop?category=women" className="text-gray-400 hover:text-white transition-colors">Women's Fashion</Link></li>
              <li><Link to="/shop?category=kids" className="text-gray-400 hover:text-white transition-colors">Kids Fashion</Link></li>
              <li><Link to="/shop?category=vintage" className="text-gray-400 hover:text-white transition-colors">Vintage Collection</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <a href="https://wa.me/254700000000" className="text-gray-400 hover:text-white transition-colors">
                  +254 700 000 000
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <a href="mailto:hello@thrifthavenke.com" className="text-gray-400 hover:text-white transition-colors">
                  hello@thrifthavenke.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Thrift Haven KE. All rights reserved. | Made with ❤️ in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
