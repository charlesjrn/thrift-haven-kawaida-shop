
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSales } from '@/contexts/SalesContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSign, 
  ShoppingCart,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CashierDashboard() {
  const { sales, getTodaysSales, getSalesByCashier } = useSales();
  const { user } = useAuth();

  const todaysSales = getTodaysSales();
  const mySales = getSalesByCashier(user?.id || '');
  const myTodaysSales = mySales.filter(sale => {
    const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return saleDate === today;
  });

  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const myTodaysRevenue = myTodaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const myTotalRevenue = mySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const stats = [
    {
      title: "My Today's Sales",
      value: `KSh ${myTodaysRevenue.toLocaleString()}`,
      description: `${myTodaysSales.length} transactions`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "My Total Sales",
      value: `KSh ${myTotalRevenue.toLocaleString()}`,
      description: `${mySales.length} total transactions`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Store Today",
      value: `KSh ${todaysRevenue.toLocaleString()}`,
      description: `${todaysSales.length} total transactions`,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Last Sale",
      value: myTodaysSales.length > 0 ? new Date(myTodaysSales[myTodaysSales.length - 1].timestamp).toLocaleTimeString() : "No sales",
      description: myTodaysSales.length > 0 ? `KSh ${myTodaysSales[myTodaysSales.length - 1].totalAmount.toLocaleString()}` : "today",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="text-gray-600">Ready to make some sales today?</p>
        </div>
        <Link to="/cashier/pos">
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

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Sales</CardTitle>
          <CardDescription>
            Your recent transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myTodaysSales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No sales recorded today.</p>
              <p className="text-sm text-gray-400">Start selling to see your transactions here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTodaysSales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Sale #{sale.id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {sale.items.length} items - {new Date(sale.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      KSh {sale.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {sale.paymentMethod}
                    </p>
                  </div>
                </div>
              ))}
              {myTodaysSales.length > 5 && (
                <Link to="/cashier/sales">
                  <Button variant="outline" className="w-full">
                    View All Sales
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for cashiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/cashier/pos">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <ShoppingCart className="h-6 w-6" />
                <span>New Sale</span>
              </Button>
            </Link>
            <Link to="/cashier/sales">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span>View Sales</span>
              </Button>
            </Link>
            <Link to="/cashier/daily-report">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6" />
                <span>Daily Report</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
