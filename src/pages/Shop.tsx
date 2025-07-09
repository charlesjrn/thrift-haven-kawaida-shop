
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const products = [
    {
      id: 1,
      name: "Vintage Denim Jacket",
      price: "KSh 1,200",
      originalPrice: "KSh 3,500",
      category: "vintage",
      condition: "Excellent",
      size: "M",
      image: "/lovable-uploads/denim-jacket.jpg"
    },
    {
      id: 2,
      name: "Designer Sneakers",
      price: "KSh 2,800",
      originalPrice: "KSh 8,000",
      category: "shoes",
      condition: "Very Good",
      size: "42",
      image: "/lovable-uploads/sneakers.jpg"
    },
    {
      id: 3,
      name: "Floral Summer Dress",
      price: "KSh 900",
      originalPrice: "KSh 2,500",
      category: "women",
      condition: "Good",
      size: "L",
      image: "/lovable-uploads/summer-dress.jpg"
    },
    {
      id: 4,
      name: "Leather Handbag",
      price: "KSh 1,800",
      originalPrice: "KSh 5,000",
      category: "accessories",
      condition: "Excellent",
      size: "One Size",
      image: "/lovable-uploads/handbag.jpg"
    },
    {
      id: 5,
      name: "Men's Formal Shirt",
      price: "KSh 650",
      originalPrice: "KSh 1,800",
      category: "men",
      condition: "Very Good",
      size: "L",
      image: "/lovable-uploads/formal-shirt.jpg"
    },
    {
      id: 6,
      name: "Kids Rainbow T-Shirt",
      price: "KSh 450",
      originalPrice: "KSh 1,200",
      category: "kids",
      condition: "Good",
      size: "Age 8-10",
      image: "/lovable-uploads/kids-tshirt.jpg"
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "men", label: "Men's Fashion" },
    { value: "women", label: "Women's Fashion" },
    { value: "kids", label: "Kids Fashion" },
    { value: "vintage", label: "Vintage Collection" },
    { value: "shoes", label: "Shoes" },
    { value: "accessories", label: "Accessories" }
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory === "all") return true;
    return product.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Collection</h1>
          <p className="text-xl opacity-90">
            Discover amazing thrift finds - quality fashion at unbeatable prices
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Filter by:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1000">Under KSh 1,000</SelectItem>
                  <SelectItem value="1000-2000">KSh 1,000 - 2,000</SelectItem>
                  <SelectItem value="over-2000">Over KSh 2,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-center px-4">
                        {product.name}
                      </span>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-green-600">
                      {product.condition}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-orange-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Size: {product.size}</span>
                      <Badge variant="outline" className="text-xs">
                        {categories.find(cat => cat.value === product.category)?.label}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => {
                        const message = `Hi! I'm interested in the ${product.name} (Size: ${product.size}) for ${product.price}. Is it still available?`;
                        window.open(`https://wa.me/254700000000?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      Order via WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
