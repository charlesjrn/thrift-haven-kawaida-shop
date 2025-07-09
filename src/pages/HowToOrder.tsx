
import { MessageCircle, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HowToOrder = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Order</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Simple steps to get your favorite thrift finds delivered to your doorstep
          </p>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              
              {/* Step 1 */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">1</span>
                    </div>
                    Browse & Select Your Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Visit our Shop page and browse through our curated collection of thrift fashion. 
                    Use filters to find exactly what you're looking for - whether it's men's, women's, 
                    kids', or vintage pieces.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Check item condition and size details</li>
                    <li>View multiple photos of each item</li>
                    <li>Compare original vs. thrift prices</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    Order via WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Click the "Order via WhatsApp" button on any item you want. This will open WhatsApp 
                    with a pre-filled message containing the item details.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 italic">
                      Example message: "Hi! I'm interested in the Vintage Denim Jacket (Size: M) for KSh 1,200. 
                      Is it still available?"
                    </p>
                  </div>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start WhatsApp Order
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    Confirm Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Our team will respond quickly to confirm item availability, provide additional photos 
                    if needed, and calculate your total including delivery costs.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Item availability confirmation</li>
                    <li>Final price calculation with delivery</li>
                    <li>Estimated delivery timeline</li>
                    <li>Alternative suggestions if item is unavailable</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    Make Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    We accept multiple payment methods for your convenience:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">M-PESA (Most Popular)</h4>
                      <p className="text-sm text-green-700">
                        Pay directly through M-PESA to our business number. 
                        Quick, secure, and convenient.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Bank Transfer</h4>
                      <p className="text-sm text-blue-700">
                        Direct bank transfer for larger orders. 
                        Bank details provided via WhatsApp.
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> We also accept cash on delivery within Nairobi CBD and selected areas.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-red-600" />
                    </div>
                    Delivery & Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Once payment is confirmed, we'll process and dispatch your order:
                  </p>
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-gray-300 pl-4">
                      <h4 className="font-semibold mb-2">Within Nairobi</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Same-day delivery available (orders before 2 PM)</li>
                        <li>• Delivery fee: KSh 200-500 depending on location</li>
                        <li>• Free delivery for orders above KSh 3,000</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-l-gray-300 pl-4">
                      <h4 className="font-semibold mb-2">Outside Nairobi</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 2-3 business days via courier services</li>
                        <li>• Delivery fee varies by location (KSh 300-800)</li>
                        <li>• Tracking number provided</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I return items if they don't fit?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Yes! We offer exchanges within 3 days of delivery if the item doesn't fit as expected. 
                    The item must be in the same condition as received. Return shipping costs apply.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do you ensure item quality?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Every item goes through our quality check process including cleaning, condition assessment, 
                    and detailed photography. We clearly state the condition of each item (Excellent, Very Good, Good).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer bulk discounts?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Yes! Orders of 5+ items get 10% discount, and orders of 10+ items get 15% discount. 
                    Contact us via WhatsApp for bulk order pricing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToOrder;
