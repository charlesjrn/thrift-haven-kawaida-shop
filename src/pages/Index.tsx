
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Heart, Truck, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import product images
import denimJacketImg from "@/assets/denim-jacket.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import summerDressImg from "@/assets/summer-dress.jpg";
import handbagImg from "@/assets/handbag.jpg";

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Vintage Denim Jacket",
      price: "KSh 1,200",
      originalPrice: "KSh 3,500",
      image: denimJacketImg,
      category: "Vintage"
    },
    {
      id: 2,
      name: "Designer Sneakers",
      price: "KSh 2,800",
      originalPrice: "KSh 8,000",
      image: sneakersImg,
      category: "Shoes"
    },
    {
      id: 3,
      name: "Floral Summer Dress",
      price: "KSh 900",
      originalPrice: "KSh 2,500",
      image: summerDressImg,
      category: "Women"
    },
    {
      id: 4,
      name: "Leather Handbag",
      price: "KSh 1,800",
      originalPrice: "KSh 5,000",
      image: handbagImg,
      category: "Accessories"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Mtush Fashion, <br />
              <span className="text-yellow-300">Budget-Friendly Prices</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover quality second-hand fashion that fits your style and budget. 
              From vintage treasures to modern must-haves - karibu Thrift Haven KE!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-orange-600"
              >
                <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Order
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Thrift</h3>
              <p className="text-muted-foreground">Hand-picked, quality second-hand items at unbeatable prices</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-muted-foreground">Sustainable fashion that's good for you and the environment</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick delivery within Nairobi and major towns across Kenya</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
            <p className="text-xl text-muted-foreground">Check out these popular picks from our collection</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-orange-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Thrift Like a Pro?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of fashion-savvy Kenyans who shop smart at Thrift Haven KE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <Link to="/how-to-order">How to Order</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
