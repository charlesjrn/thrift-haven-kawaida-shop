import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Package, AlertTriangle, TrendingDown, RotateCcw, Clock, 
  DollarSign, Activity, Archive, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { useSales } from '@/contexts/SalesContext';

export default function InventoryAnalytics() {
  const { products } = useInventory();
  const { sales } = useSales();
  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('turnover');

  // Calculate inventory metrics
  const getInventoryMetrics = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const recentSales = sales.filter(sale => new Date(sale.timestamp) >= startDate);
    
    // Calculate product velocity and turnover
    const productMetrics = products.map(product => {
      const productSales = recentSales.flatMap(sale => 
        sale.items.filter(item => item.productName === product.name)
      );
      
      const totalSold = productSales.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = productSales.reduce((sum, item) => sum + item.total, 0);
      const salesFrequency = productSales.length;
      
      // Inventory turnover = Cost of Goods Sold / Average Inventory
      const avgInventory = (product.stock + totalSold) / 2;
      const turnoverRate = avgInventory > 0 ? totalSold / avgInventory : 0;
      
      // Days of inventory = Current Stock / Average Daily Sales
      const avgDailySales = totalSold / days;
      const daysOfInventory = avgDailySales > 0 ? product.stock / avgDailySales : Infinity;
      
      // Stock health score (0-100)
      const stockRatio = product.stock / (product.minStock || 1);
      const healthScore = Math.min(100, Math.max(0, (stockRatio - 0.5) * 50));
      
      return {
        ...product,
        totalSold,
        totalRevenue,
        salesFrequency,
        turnoverRate,
        daysOfInventory,
        healthScore,
        stockValue: product.stock * product.price,
        velocity: totalSold / days, // units per day
        trend: totalSold > 0 ? 'selling' : 'stagnant'
      };
    });
    
    return productMetrics;
  };

  const getCategoryAnalysis = () => {
    const productMetrics = getInventoryMetrics();
    const categoryStats: { [key: string]: {
      totalStock: number;
      totalValue: number;
      totalSold: number;
      productCount: number;
      avgTurnover: number;
      lowStockCount: number;
    } } = {};

    productMetrics.forEach(product => {
      const category = product.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          totalStock: 0,
          totalValue: 0,
          totalSold: 0,
          productCount: 0,
          avgTurnover: 0,
          lowStockCount: 0
        };
      }
      
      categoryStats[category].totalStock += product.stock;
      categoryStats[category].totalValue += product.stockValue;
      categoryStats[category].totalSold += product.totalSold;
      categoryStats[category].productCount += 1;
      categoryStats[category].avgTurnover += product.turnoverRate;
      
      if (product.stock <= product.minStock) {
        categoryStats[category].lowStockCount += 1;
      }
    });

    // Calculate averages
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.avgTurnover = stats.avgTurnover / stats.productCount;
    });

    return Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      ...stats
    }));
  };

  const getStockAlerts = () => {
    const productMetrics = getInventoryMetrics();
    
    const alerts = {
      lowStock: productMetrics.filter(p => p.stock <= p.minStock),
      overStock: productMetrics.filter(p => p.daysOfInventory > 90 && p.daysOfInventory !== Infinity),
      deadStock: productMetrics.filter(p => p.totalSold === 0 && p.stock > 0),
      fastMoving: productMetrics.filter(p => p.velocity > 2).slice(0, 5),
      slowMoving: productMetrics.filter(p => p.velocity < 0.1 && p.velocity > 0).slice(0, 5)
    };

    return alerts;
  };

  const getValueDistribution = () => {
    const productMetrics = getInventoryMetrics();
    
    const ranges = [
      { name: 'High Value (>50K)', min: 50000, max: Infinity, count: 0, value: 0 },
      { name: 'Medium Value (10K-50K)', min: 10000, max: 50000, count: 0, value: 0 },
      { name: 'Low Value (<10K)', min: 0, max: 10000, count: 0, value: 0 }
    ];

    productMetrics.forEach(product => {
      ranges.forEach(range => {
        if (product.stockValue >= range.min && product.stockValue < range.max) {
          range.count += 1;
          range.value += product.stockValue;
        }
      });
    });

    return ranges;
  };

  const getTurnoverTrend = () => {
    // Simulate historical turnover data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      turnover: Math.random() * 5 + 2,
      target: 4
    }));
  };

  const productMetrics = getInventoryMetrics();
  const categoryAnalysis = getCategoryAnalysis();
  const stockAlerts = getStockAlerts();
  const valueDistribution = getValueDistribution();

  // Sort products based on selected criteria
  const sortedProducts = [...productMetrics].sort((a, b) => {
    switch (sortBy) {
      case 'turnover': return b.turnoverRate - a.turnoverRate;
      case 'value': return b.stockValue - a.stockValue;
      case 'velocity': return b.velocity - a.velocity;
      case 'health': return b.healthScore - a.healthScore;
      default: return b.turnoverRate - a.turnoverRate;
    }
  });

  const totalStockValue = productMetrics.reduce((sum, p) => sum + p.stockValue, 0);
  const avgTurnoverRate = productMetrics.reduce((sum, p) => sum + p.turnoverRate, 0) / productMetrics.length;
  const totalUnits = productMetrics.reduce((sum, p) => sum + p.stock, 0);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Analytics</h1>
          <p className="text-muted-foreground">Stock performance and optimization insights</p>
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turnover">Turnover</SelectItem>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="velocity">Velocity</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalStockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalUnits} total units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnover Rate</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTurnoverRate.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground">per period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stockAlerts.lowStock.length}</div>
            <p className="text-xs text-muted-foreground">need restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dead Stock</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockAlerts.deadStock.length}</div>
            <p className="text-xs text-muted-foreground">not moving</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={valueDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {valueDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Turnover Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={getTurnoverTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="turnover" stroke="hsl(var(--primary))" strokeWidth={3} />
                      <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <ScatterChart data={sortedProducts.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="velocity" name="Velocity" />
                    <YAxis dataKey="stockValue" name="Stock Value" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Velocity: {data.velocity.toFixed(2)} units/day
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Value: KSh {data.stockValue.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Turnover: {data.turnoverRate.toFixed(2)}x
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="stockValue" fill="hsl(var(--primary))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedProducts.slice(0, 10).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.stock} units • {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Turnover</p>
                        <p className="font-medium">{product.turnoverRate.toFixed(1)}x</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Velocity</p>
                        <p className="font-medium">{product.velocity.toFixed(1)}/day</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-medium">KSh {product.stockValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Health</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={product.healthScore} className="w-16" />
                          <span className="text-xs">{Math.round(product.healthScore)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={categoryAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalValue" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryAnalysis.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.productCount} products • {category.totalStock} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KSh {category.totalValue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.avgTurnover.toFixed(1)}x turnover
                        </p>
                        {category.lowStockCount > 0 && (
                          <Badge variant="destructive" className="mt-1">
                            {category.lowStockCount} low stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span>Low Stock Alert</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockAlerts.lowStock.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {product.stock} • Min: {product.minStock}
                        </p>
                      </div>
                      <Badge variant="destructive">Restock</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-warning" />
                  <span>Slow Moving Stock</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockAlerts.slowMoving.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-warning/5">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Velocity: {product.velocity.toFixed(2)} units/day
                        </p>
                      </div>
                      <Badge variant="outline" className="border-warning text-warning">
                        Slow
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-success" />
                  <span>Fast Moving Stock</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockAlerts.fastMoving.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-success/20 bg-success/5">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Velocity: {product.velocity.toFixed(2)} units/day
                        </p>
                      </div>
                      <Badge variant="outline" className="border-success text-success">
                        Fast
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  <span>Dead Stock</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockAlerts.deadStock.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} • No sales
                        </p>
                      </div>
                      <Badge variant="secondary">Review</Badge>
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