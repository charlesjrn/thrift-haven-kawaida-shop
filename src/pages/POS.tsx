
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Plus, Minus, Smartphone, CheckCircle } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { useSales } from '@/contexts/SalesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SaleItem } from '@/types';

export default function POS() {
  const { products } = useInventory();
  const { addSale } = useSales();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card'>('cash');
  const [customerPhone, setCustomerPhone] = useState('');
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.unitPrice
            }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId 
        ? { 
            ...item, 
            quantity,
            total: quantity * item.unitPrice
          } 
        : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const initiatePayment = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (paymentMethod === 'mpesa') {
      if (!customerPhone) {
        toast.error('Please enter customer phone number');
        return;
      }
      setShowMpesaPrompt(true);
      // Simulate M-Pesa STK push
      setMpesaStatus('pending');
      toast.info('M-Pesa payment request sent to customer phone');
      
      // Simulate payment response (replace with actual M-Pesa API)
      setTimeout(() => {
        setMpesaStatus('success');
        toast.success('M-Pesa payment received! Complete the sale.');
      }, 5000);
    } else {
      completeSale();
    }
  };

  const completeSale = () => {
    const mpesaTransactionId = mpesaStatus === 'success' ? `MPE${Date.now()}` : undefined;
    
    addSale({
      items: cart,
      totalAmount,
      paymentMethod,
      cashierId: user?.id || '',
      cashierName: user?.username || '',
      mpesaTransactionId
    });

    setCart([]);
    setCustomerPhone('');
    setMpesaStatus('idle');
    setShowMpesaPrompt(false);
    toast.success('Sale completed successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Search and add products to cart</CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-600">{product.brand} - {product.size}</p>
                  <p className="text-lg font-bold text-green-600">KSh {product.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full mt-2"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cart.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-600">KSh {item.unitPrice.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>KSh {totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium">Payment Method</label>
                    <div className="flex space-x-2">
                      <Button
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('cash')}
                        className="flex-1"
                      >
                        Cash
                      </Button>
                      <Button
                        variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('mpesa')}
                        className="flex-1 flex items-center space-x-1"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>M-Pesa</span>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === 'mpesa' && (
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium">Customer Phone Number</label>
                      <Input
                        placeholder="e.g., 254712345678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        type="tel"
                      />
                    </div>
                  )}

                  {showMpesaPrompt && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {mpesaStatus === 'pending' && (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-700">Waiting for customer payment...</span>
                          </>
                        )}
                        {mpesaStatus === 'success' && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700">Payment received! Click Complete Sale.</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={mpesaStatus === 'success' ? completeSale : initiatePayment}
                    className="w-full mt-4"
                    size="lg"
                    disabled={mpesaStatus === 'pending'}
                  >
                    {mpesaStatus === 'pending' ? 'Waiting for Payment...' : 
                     mpesaStatus === 'success' ? 'Complete Sale' : 
                     paymentMethod === 'mpesa' ? 'Send Payment Request' : 'Complete Sale'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
