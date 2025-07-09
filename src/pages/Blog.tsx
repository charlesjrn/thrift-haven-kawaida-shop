
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Thrift Shopping in Nairobi",
      excerpt: "Discover the best thrift markets in Nairobi and learn insider tips for finding amazing deals on quality fashion pieces.",
      author: "Sarah K.",
      date: "Dec 15, 2024",
      category: "Shopping Tips",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "How to Style Vintage Pieces for Modern Looks",
      excerpt: "Transform vintage thrift finds into contemporary outfits with these expert styling tips and tricks.",
      author: "Mike O.",
      date: "Dec 10, 2024",
      category: "Fashion Tips",
      readTime: "4 min read",
      featured: false
    },
    {
      id: 3,
      title: "Sustainable Fashion: Why Thrifting Matters in Kenya",
      excerpt: "Explore the environmental impact of fast fashion and how thrift shopping is making a difference in Kenya's fashion landscape.",
      author: "Grace M.",
      date: "Dec 5, 2024",
      category: "Sustainability",
      readTime: "6 min read",
      featured: true
    },
    {
      id: 4,
      title: "Customer Spotlight: Janet's Thrift Transformation",
      excerpt: "Meet Janet, a university student who completely revamped her wardrobe on a budget with Thrift Haven KE finds.",
      author: "Thrift Haven Team",
      date: "Nov 30, 2024",
      category: "Customer Stories",
      readTime: "3 min read",
      featured: false
    },
    {
      id: 5,
      title: "Building a Capsule Wardrobe with Thrift Finds",
      excerpt: "Learn how to create a versatile, minimalist wardrobe using quality thrift pieces that mix and match effortlessly.",
      author: "Linda W.",
      date: "Nov 25, 2024",
      category: "Fashion Tips",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 6,
      title: "The Rise of Thrift Culture Among Kenyan Gen Z",
      excerpt: "Examining how young Kenyans are embracing thrift fashion as a form of self-expression and environmental consciousness.",
      author: "David K.",
      date: "Nov 20, 2024",
      category: "Culture",
      readTime: "5 min read",
      featured: true
    }
  ];

  const categories = ["All", "Fashion Tips", "Shopping Tips", "Sustainability", "Customer Stories", "Culture"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Thrift Haven Blog</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Fashion tips, thrift culture insights, and stories from the Kenyan fashion community
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Posts</h2>
            <p className="text-gray-600">Don't miss these popular articles from our community</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {blogPosts.filter(post => post.featured).slice(0, 2).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                  <span className="text-orange-800 font-medium text-center px-4">
                    {post.title}
                  </span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">All Posts</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="hover:bg-orange-50 hover:border-orange-200"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-center px-4 text-sm">
                    {post.title}
                  </span>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest fashion tips and thrift finds delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
