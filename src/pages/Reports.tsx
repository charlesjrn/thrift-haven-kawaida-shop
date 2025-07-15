
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package, Users, Download } from 'lucide-react';
import { useSales } from '@/contexts/SalesContext';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Reports() {
  const { sales, getBestSellingProducts, getTodaysSales } = useSales();
  const { products } = useInventory();
  const { users } = useAuth();
  const [reportPeriod, setReportPeriod] = useState('month');

  const getFilteredSales = () => {
    let filteredSales = sales;
    
    if (reportPeriod === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
        return saleDate === today;
      });
    } else if (reportPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredSales = sales.filter(sale => 
        new Date(sale.timestamp) >= weekAgo
      );
    } else if (reportPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredSales = sales.filter(sale => 
        new Date(sale.timestamp) >= monthAgo
      );
    }
    
    return filteredSales;
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const bestSellingProducts = getBestSellingProducts().slice(0, 5);

  // Daily sales for chart
  const dailySalesData = () => {
    const salesByDate: { [date: string]: number } = {};
    
    filteredSales.forEach(sale => {
      const date = new Date(sale.timestamp).toISOString().split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + sale.totalAmount;
    });

    return Object.entries(salesByDate)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString(),
        revenue
      }))
      .slice(-7); // Last 7 days
  };

  // Category distribution
  const categoryData = () => {
    const categoryRevenue: { [category: string]: number } = {};
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        if (product) {
          const category = product.category;
          categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity);
        }
      });
    });

    return Object.entries(categoryRevenue).map(([category, revenue]) => ({
      name: category,
      value: revenue
    }));
  };

  // Staff performance
  const staffPerformance = () => {
    const staffSales: { [cashierId: string]: { name: string; revenue: number; sales: number } } = {};
    
    filteredSales.forEach(sale => {
      if (!staffSales[sale.cashierId]) {
        staffSales[sale.cashierId] = {
          name: sale.cashierName,
          revenue: 0,
          sales: 0
        };
      }
      staffSales[sale.cashierId].revenue += sale.totalAmount;
      staffSales[sale.cashierId].sales += 1;
    });

    return Object.values(staffSales);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredSales.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Units sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSh {filteredSales.length > 0 ? Math.round(totalRevenue / filteredSales.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>Revenue over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={dailySalesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Best Selling Products</CardTitle>
          <CardDescription>Top performing products in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bestSellingProducts.map((product, index) => (
              <div key={product.productName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">{product.quantitySold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    KSh {product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
          <CardDescription>Sales performance by team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffPerformance().map((staff, index) => (
              <div key={staff.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-gray-600">{staff.sales} transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    KSh {staff.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Avg: KSh {staff.sales > 0 ? Math.round(staff.revenue / staff.sales).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
