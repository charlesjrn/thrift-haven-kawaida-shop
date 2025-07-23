import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Package, DollarSign, Calendar,
  Target, Activity, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useSales } from '@/contexts/SalesContext';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdvancedAnalytics() {
  const { sales, getBestSellingProducts } = useSales();
  const { products } = useInventory();
  const { users } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  // Advanced metrics calculations
  const getAdvancedMetrics = () => {
    const now = new Date();
    let startDate: Date;
    let comparisonStartDate: Date;
    let comparisonEndDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        comparisonStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        comparisonEndDate = startDate;
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        comparisonStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        comparisonEndDate = startDate;
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        comparisonStartDate = new Date(startDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        comparisonEndDate = startDate;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        comparisonStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        comparisonEndDate = startDate;
    }

    const currentPeriodSales = sales.filter(sale => new Date(sale.timestamp) >= startDate);
    const comparisonPeriodSales = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= comparisonStartDate && saleDate < comparisonEndDate;
    });

    const currentRevenue = currentPeriodSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const comparisonRevenue = comparisonPeriodSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const revenueChange = comparisonRevenue > 0 ? ((currentRevenue - comparisonRevenue) / comparisonRevenue) * 100 : 0;

    const currentTransactions = currentPeriodSales.length;
    const comparisonTransactions = comparisonPeriodSales.length;
    const transactionChange = comparisonTransactions > 0 ? ((currentTransactions - comparisonTransactions) / comparisonTransactions) * 100 : 0;

    const avgOrderValue = currentTransactions > 0 ? currentRevenue / currentTransactions : 0;
    const comparisonAvgOrderValue = comparisonTransactions > 0 ? comparisonRevenue / comparisonTransactions : 0;
    const aovChange = comparisonAvgOrderValue > 0 ? ((avgOrderValue - comparisonAvgOrderValue) / comparisonAvgOrderValue) * 100 : 0;

    return {
      currentRevenue,
      revenueChange,
      currentTransactions,
      transactionChange,
      avgOrderValue,
      aovChange,
      currentPeriodSales,
      comparisonPeriodSales
    };
  };

  const metrics = getAdvancedMetrics();

  // Hourly sales pattern
  const getHourlySalesPattern = () => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      sales: 0,
      revenue: 0
    }));

    metrics.currentPeriodSales.forEach(sale => {
      const hour = new Date(sale.timestamp).getHours();
      hourlyData[hour].sales += 1;
      hourlyData[hour].revenue += sale.totalAmount;
    });

    return hourlyData;
  };

  // Customer segment analysis
  const getCustomerSegments = () => {
    const segments = {
      'High Value': { count: 0, revenue: 0, threshold: 5000 },
      'Medium Value': { count: 0, revenue: 0, threshold: 2000 },
      'Low Value': { count: 0, revenue: 0, threshold: 0 }
    };

    const cashierTotals: { [key: string]: number } = {};
    
    metrics.currentPeriodSales.forEach(sale => {
      cashierTotals[sale.cashierId] = (cashierTotals[sale.cashierId] || 0) + sale.totalAmount;
    });

    Object.values(cashierTotals).forEach(total => {
      if (total >= segments['High Value'].threshold) {
        segments['High Value'].count++;
        segments['High Value'].revenue += total;
      } else if (total >= segments['Medium Value'].threshold) {
        segments['Medium Value'].count++;
        segments['Medium Value'].revenue += total;
      } else {
        segments['Low Value'].count++;
        segments['Low Value'].revenue += total;
      }
    });

    return Object.entries(segments).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue
    }));
  };

  // Product performance matrix
  const getProductPerformanceMatrix = () => {
    const productStats: { [key: string]: { revenue: number; quantity: number; frequency: number } } = {};

    metrics.currentPeriodSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productStats[item.productName]) {
          productStats[item.productName] = { revenue: 0, quantity: 0, frequency: 0 };
        }
        productStats[item.productName].revenue += item.total;
        productStats[item.productName].quantity += item.quantity;
        productStats[item.productName].frequency += 1;
      });
    });

    return Object.entries(productStats).map(([name, stats]) => ({
      name,
      revenue: stats.revenue,
      quantity: stats.quantity,
      frequency: stats.frequency,
      avgPrice: stats.quantity > 0 ? stats.revenue / stats.quantity : 0
    })).sort((a, b) => b.revenue - a.revenue);
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--destructive))'];

  const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) => (
    <Card className="glass-card shadow-elegant">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prefix}{value.toLocaleString()}{suffix}</div>
        <div className="flex items-center text-xs mt-1">
          {change >= 0 ? (
            <ArrowUpRight className="h-3 w-3 text-success mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
          )}
          <span className={change >= 0 ? 'text-success' : 'text-destructive'}>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-muted-foreground ml-1">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">Deep insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.currentRevenue}
          change={metrics.revenueChange}
          icon={DollarSign}
          prefix="KSh "
        />
        <MetricCard
          title="Transactions"
          value={metrics.currentTransactions}
          change={metrics.transactionChange}
          icon={Activity}
        />
        <MetricCard
          title="Avg Order Value"
          value={Math.round(metrics.avgOrderValue)}
          change={metrics.aovChange}
          icon={Target}
          prefix="KSh "
        />
        <MetricCard
          title="Active Products"
          value={products.length}
          change={0}
          icon={Package}
        />
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Sales Trends</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={getHourlySalesPattern()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={getHourlySalesPattern()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Transactions']} />
                      <Bar dataKey="sales" fill="hsl(var(--success))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Hourly Sales Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={getHourlySalesPattern()}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Product Performance Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getProductPerformanceMatrix().slice(0, 10).map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} units • {product.frequency} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">KSh {product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Avg: KSh {Math.round(product.avgPrice).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={getCustomerSegments()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getCustomerSegments().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Segment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCustomerSegments().map((segment, index) => (
                    <div key={segment.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{segment.name}</p>
                          <p className="text-sm text-muted-foreground">{segment.count} customers</p>
                        </div>
                      </div>
                      <p className="font-medium text-success">
                        KSh {segment.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}