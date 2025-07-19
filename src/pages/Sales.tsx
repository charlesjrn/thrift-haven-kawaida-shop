
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Filter, Download } from 'lucide-react';
import { useSales } from '@/contexts/SalesContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Sales() {
  const { sales, getTodaysSales, getSalesByCashier } = useSales();
  const { user } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredSales = () => {
    let filteredSales = sales;

    // Filter by user role
    if (user?.role === 'cashier') {
      filteredSales = getSalesByCashier(user.id);
    }

    // Filter by period
    if (filterPeriod === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
        return saleDate === today;
      });
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredSales = filteredSales.filter(sale => 
        new Date(sale.timestamp) >= weekAgo
      );
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredSales = filteredSales.filter(sale => 
        new Date(sale.timestamp) >= monthAgo
      );
    }

    // Filter by search term
    if (searchTerm) {
      filteredSales = filteredSales.filter(sale =>
        sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.cashierName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredSales.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const printReceipt = (sale: any) => {
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${sale.id.slice(-6)}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>AZIZ WINES AND SPIRITS</h2>
              <p>Receipt #${sale.id.slice(-6)}</p>
              <p>${new Date(sale.timestamp).toLocaleString()}</p>
              <p>Cashier: ${sale.cashierName}</p>
            </div>
            ${sale.items.map((item: any) => `
              <div class="item">
                <span>${item.productName} x${item.quantity}</span>
                <span>KSh ${item.total.toLocaleString()}</span>
              </div>
            `).join('')}
            <div class="total">
              <div class="item">
                <span>TOTAL</span>
                <span>KSh ${sale.totalAmount.toLocaleString()}</span>
              </div>
              <div class="item">
                <span>Payment Method</span>
                <span>${sale.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <p>Thank you for your business!</p>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
      receiptWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Records</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' ? 'All sales transactions' : 'Your sales transactions'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            KSh {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search by receipt ID or cashier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filteredSales.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No sales records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">Receipt #{sale.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(sale.timestamp).toLocaleString()}
                      </p>
                      {user?.role === 'admin' && (
                        <p className="text-sm text-gray-600">
                          Cashier: {sale.cashierName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        KSh {sale.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {sale.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">Items ({sale.items.length})</h4>
                    <div className="space-y-1">
                      {sale.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>KSh {item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printReceipt(sale)}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
