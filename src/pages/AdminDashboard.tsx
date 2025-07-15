
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { useSales } from '@/contexts/SalesContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Wine,
  ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { products, getLowStockProducts } = useInventory();
  const { sales, getTodaysSales, getTotalSales, getBestSellingProducts } = useSales();
  const { user } = useAuth();

  const todaysSales = getTodaysSales();
  const totalSales = getTotalSales();
  const lowStockItems = getLowStockProducts();
  const bestSelling = getBestSellingProducts();

  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const stats = [
    {
      title: "Today's Sales",
      value: `KSh ${todaysRevenue.toLocaleString()}`,
      description: `${todaysSales.length} transactions`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: `KSh ${totalSales.toLocaleString()}`,
      description: `${sales.length} total sales`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Products in Stock",
      value: products.length.toString(),
      description: `${lowStockItems.length} low stock items`,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.length.toString(),
      description: "Requires attention",
      icon: AlertTriangle,
      color: lowStockItems.length > 0 ? "text-red-600" : "text-gray-600",
      bgColor: lowStockItems.length > 0 ? "bg-red-50" : "bg-gray-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600">Here's what's happening with your store today.</p>
        </div>
        <Link to="/admin/pos">
          <Button size="lg" className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Start Selling</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Low Stock Alerts</span>
            </CardTitle>
            <CardDescription>
              Products that need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">All products are well stocked!</p>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand} - {product.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {product.stock} left
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {product.minStock}
                      </p>
                    </div>
                  </div>
                ))}
                {lowStockItems.length > 5 && (
                  <Link to="/admin/products">
                    <Button variant="outline" className="w-full">
                      View All ({lowStockItems.length})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wine className="h-5 w-5 text-purple-500" />
              <span>Best Selling Products</span>
            </CardTitle>
            <CardDescription>
              Top performers this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bestSelling.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sales data available yet.</p>
            ) : (
              <div className="space-y-3">
                {bestSelling.slice(0, 5).map((product, index) => (
                  <div key={product.productName} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white text-sm font-bold rounded-full">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-600">{product.quantitySold} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        KSh {product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {bestSelling.length > 5 && (
                  <Link to="/admin/reports">
                    <Button variant="outline" className="w-full">
                      View Full Report
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link to="/admin/pos">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <ShoppingCart className="h-6 w-6" />
                <span>New Sale</span>
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Button>
            </Link>
            <Link to="/admin/sales">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span>View Sales</span>
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
