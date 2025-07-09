
import { Heart, Leaf, Users, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Thrift Haven KE</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Empowering Kenyan youth with sustainable fashion choices since 2023
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                Thrift Haven KE was born from a simple idea: everyone deserves to look mtush without breaking the bank. 
                Founded in 2023 by young Kenyan entrepreneurs who understood the struggle of wanting to stay fashionable 
                on a tight budget, we set out to revolutionize how Kenyans shop for clothes.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What started as a small collection of hand-picked thrift items has grown into Kenya's most loved 
                online thrift destination. We believe that great style shouldn't cost a fortune, and that sustainable 
                fashion choices can make a real difference for our planet and our wallets.
              </p>
              <p className="text-lg leading-relaxed">
                Every item in our collection is carefully selected, cleaned, and quality-checked before it reaches you. 
                We're not just selling clothes – we're building a community of conscious consumers who value both 
                style and sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're driven by values that reflect the heart of Kenyan community spirit
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Affordable Fashion</h3>
              <p className="text-gray-600">
                Making quality fashion accessible to every Kenyan, regardless of budget
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Reducing fashion waste while promoting circular economy principles
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">
                Building connections and supporting local fashion culture
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p className="text-gray-600">
                Ensuring every item meets our high standards before reaching you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Environmental Impact</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-700">Clothes saved from landfills</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
                <div className="text-gray-700">Reduction in fashion carbon footprint</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
                <div className="text-gray-700">Happy customers served</div>
              </div>
            </div>
            <p className="text-lg text-gray-700">
              By choosing thrift fashion, you're not just saving money – you're helping create a more 
              sustainable future for Kenya and our planet. Every purchase contributes to reducing textile 
              waste and supporting circular economy principles.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600">
              The passionate people behind Thrift Haven KE
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our team consists of young, passionate Kenyans who understand the local fashion scene 
              and are committed to making quality thrift fashion accessible to everyone. From our 
              fashion curators who hand-pick every item to our customer service team who ensure 
              your shopping experience is seamless, we're all united by our love for sustainable 
              fashion and our commitment to serving the Kenyan community.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
