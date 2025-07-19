import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { useSales } from '@/contexts/SalesContext';
import { Package, TrendingUp, TrendingDown, Archive } from 'lucide-react';

export default function DailyReport() {
  const { products } = useInventory();
  const { getTodaysSales } = useSales();
  
  const todaysSales = getTodaysSales();
  
  // Calculate stock movements for today
  const getStockReport = () => {
    const soldToday: { [key: string]: number } = {};
    
    // Calculate sold quantities from today's sales
    todaysSales.forEach(sale => {
      sale.items.forEach(item => {
        soldToday[item.productName] = (soldToday[item.productName] || 0) + item.quantity;
      });
    });
    
    return products.map(product => {
      const soldQuantity = soldToday[product.name] || 0;
      const openingStock = product.stock + soldQuantity; // Assuming current stock is closing
      const purchasedStock = 0; // This would need to be tracked separately
      const closingStock = product.stock;
      
      return {
        productName: product.name,
        openingStock,
        purchasedStock,
        soldStock: soldQuantity,
        closingStock
      };
    });
  };
  
  const stockReport = getStockReport();
  const totalSoldToday = stockReport.reduce((sum, item) => sum + item.soldStock, 0);
  const totalOpeningStock = stockReport.reduce((sum, item) => sum + item.openingStock, 0);
  const totalClosingStock = stockReport.reduce((sum, item) => sum + item.closingStock, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Daily Stock Report</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opening Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpeningStock}</div>
            <p className="text-xs text-muted-foreground">Total units at start</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchased Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Units purchased today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSoldToday}</div>
            <p className="text-xs text-muted-foreground">Units sold today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closing Stock</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClosingStock}</div>
            <p className="text-xs text-muted-foreground">Units remaining</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Stock Report */}
      <Card>
        <CardHeader>
          <CardTitle>Product-wise Stock Movement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Product Name</th>
                  <th className="text-right p-2 font-medium">Opening Stock</th>
                  <th className="text-right p-2 font-medium">Purchased</th>
                  <th className="text-right p-2 font-medium">Sold</th>
                  <th className="text-right p-2 font-medium">Closing Stock</th>
                </tr>
              </thead>
              <tbody>
                {stockReport.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2">{item.productName}</td>
                    <td className="p-2 text-right">{item.openingStock}</td>
                    <td className="p-2 text-right">{item.purchasedStock}</td>
                    <td className="p-2 text-right">{item.soldStock}</td>
                    <td className="p-2 text-right">{item.closingStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}