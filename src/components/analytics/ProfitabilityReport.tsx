import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, LineChart, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, Target, AlertTriangle,
  Download, FileSpreadsheet, Calculator, PieChart
} from 'lucide-react';
import { useSales } from '@/contexts/SalesContext';
import { useInventory } from '@/contexts/InventoryContext';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function ProfitabilityReport() {
  const { sales } = useSales();
  const { products } = useInventory();
  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('profit');

  // Calculate product costs and profits (mock data for demonstration)
  const getProductProfitability = () => {
    const productStats: { [key: string]: { 
      revenue: number; 
      quantity: number; 
      cost: number;
      profit: number;
      margin: number;
    } } = {};

    const now = new Date();
    const startDate = new Date(now.getTime() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000);
    
    const filteredSales = sales.filter(sale => new Date(sale.timestamp) >= startDate);

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.name === item.productName);
        
        if (!productStats[item.productName]) {
          productStats[item.productName] = {
            revenue: 0,
            quantity: 0,
            cost: 0,
            profit: 0,
            margin: 0
          };
        }
        
        // Mock cost calculation (typically 60-70% of selling price)
        const estimatedCost = (product?.price || item.unitPrice) * 0.65;
        const itemProfit = item.total - (estimatedCost * item.quantity);
        
        productStats[item.productName].revenue += item.total;
        productStats[item.productName].quantity += item.quantity;
        productStats[item.productName].cost += estimatedCost * item.quantity;
        productStats[item.productName].profit += itemProfit;
      });
    });

    // Calculate margins
    Object.keys(productStats).forEach(productName => {
      const stats = productStats[productName];
      stats.margin = stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0;
    });

    return Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => {
        switch (sortBy) {
          case 'profit': return b.profit - a.profit;
          case 'margin': return b.margin - a.margin;
          case 'revenue': return b.revenue - a.revenue;
          default: return b.profit - a.profit;
        }
      });
  };

  const getCategoryProfitability = () => {
    const categoryStats: { [key: string]: { revenue: number; cost: number; profit: number } } = {};
    
    const productProfitability = getProductProfitability();
    
    productProfitability.forEach(product => {
      const productInfo = products.find(p => p.name === product.name);
      const category = productInfo?.category || 'Unknown';
      
      if (!categoryStats[category]) {
        categoryStats[category] = { revenue: 0, cost: 0, profit: 0 };
      }
      
      categoryStats[category].revenue += product.revenue;
      categoryStats[category].cost += product.cost;
      categoryStats[category].profit += product.profit;
    });

    return Object.entries(categoryStats)
      .map(([name, stats]) => ({
        name,
        ...stats,
        margin: stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0
      }))
      .sort((a, b) => b.profit - a.profit);
  };

  const getDailyProfitTrend = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const dailyData: { [key: string]: { revenue: number; cost: number; profit: number } } = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dailyData[dateKey] = { revenue: 0, cost: 0, profit: 0 };
    }

    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const filteredSales = sales.filter(sale => new Date(sale.timestamp) >= startDate);

    filteredSales.forEach(sale => {
      const dateKey = new Date(sale.timestamp).toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        const saleProfit = sale.totalAmount * 0.35; // Estimated 35% profit margin
        dailyData[dateKey].revenue += sale.totalAmount;
        dailyData[dateKey].cost += sale.totalAmount * 0.65;
        dailyData[dateKey].profit += saleProfit;
      }
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString(),
      ...data
    }));
  };

  const getTotalMetrics = () => {
    const productProfitability = getProductProfitability();
    const totalRevenue = productProfitability.reduce((sum, p) => sum + p.revenue, 0);
    const totalCost = productProfitability.reduce((sum, p) => sum + p.cost, 0);
    const totalProfit = productProfitability.reduce((sum, p) => sum + p.profit, 0);
    const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return { totalRevenue, totalCost, totalProfit, overallMargin };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const productData = getProductProfitability();
    
    doc.setFontSize(16);
    doc.text('AZIZ WINES AND SPIRITS', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Profitability Report', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Period: ${timeRange}`, 105, 40, { align: 'center' });
    
    let yPosition = 60;
    
    // Headers
    doc.text('Product', 20, yPosition);
    doc.text('Revenue', 80, yPosition);
    doc.text('Cost', 110, yPosition);
    doc.text('Profit', 140, yPosition);
    doc.text('Margin %', 170, yPosition);
    
    yPosition += 10;
    doc.line(20, yPosition - 5, 190, yPosition - 5);
    
    productData.slice(0, 30).forEach((product) => {
      doc.text(product.name.substring(0, 20), 20, yPosition);
      doc.text(`KSh ${Math.round(product.revenue).toLocaleString()}`, 80, yPosition);
      doc.text(`KSh ${Math.round(product.cost).toLocaleString()}`, 110, yPosition);
      doc.text(`KSh ${Math.round(product.profit).toLocaleString()}`, 140, yPosition);
      doc.text(`${product.margin.toFixed(1)}%`, 170, yPosition);
      yPosition += 8;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
    });
    
    doc.save(`profitability-report-${timeRange}.pdf`);
  };

  const exportToExcel = () => {
    const productData = getProductProfitability();
    const categoryData = getCategoryProfitability();
    
    const workbook = XLSX.utils.book_new();
    
    // Product sheet
    const productSheet = XLSX.utils.json_to_sheet(productData.map(p => ({
      'Product Name': p.name,
      'Revenue (KSh)': Math.round(p.revenue),
      'Cost (KSh)': Math.round(p.cost),
      'Profit (KSh)': Math.round(p.profit),
      'Margin (%)': Number(p.margin.toFixed(2)),
      'Quantity Sold': p.quantity
    })));
    
    // Category sheet
    const categorySheet = XLSX.utils.json_to_sheet(categoryData.map(c => ({
      'Category': c.name,
      'Revenue (KSh)': Math.round(c.revenue),
      'Cost (KSh)': Math.round(c.cost),
      'Profit (KSh)': Math.round(c.profit),
      'Margin (%)': Number(c.margin.toFixed(2))
    })));
    
    XLSX.utils.book_append_sheet(workbook, productSheet, 'Product Profitability');
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Category Profitability');
    XLSX.writeFile(workbook, `profitability-analysis-${timeRange}.xlsx`);
  };

  const metrics = getTotalMetrics();
  const productProfitability = getProductProfitability();
  const categoryProfitability = getCategoryProfitability();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profitability Analysis</h1>
          <p className="text-muted-foreground">Detailed profit and margin analysis</p>
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
              <SelectItem value="profit">By Profit</SelectItem>
              <SelectItem value="margin">By Margin</SelectItem>
              <SelectItem value="revenue">By Revenue</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {metrics.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="gradient-success text-success-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {metrics.totalProfit.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {metrics.totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overallMargin.toFixed(1)}%</div>
            <Progress value={metrics.overallMargin} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="trends">Profit Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productProfitability.slice(0, 15).map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-medium">KSh {product.revenue.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Profit</p>
                          <p className="font-medium text-success">KSh {product.profit.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Margin</p>
                          <p className={`font-medium ${
                            product.margin >= 30 ? 'text-success' : 
                            product.margin >= 20 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {product.margin.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Progress value={Math.min(product.margin, 100)} className="w-32" />
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
                    <BarChart data={categoryProfitability}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Profit']} />
                      <Bar dataKey="profit" fill="hsl(var(--success))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Margins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryProfitability.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Revenue: KSh {category.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-success">
                          KSh {category.profit.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {category.margin.toFixed(1)}% margin
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <ComposedChart data={getDailyProfitTrend()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profit" fill="hsl(var(--success))" />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}