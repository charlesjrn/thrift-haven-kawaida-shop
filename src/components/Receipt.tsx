import { forwardRef } from 'react';
import { Sale } from '@/types';

interface ReceiptProps {
  sale: Sale;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  const currentDate = new Date(sale.timestamp);
  
  return (
    <div ref={ref} className="max-w-sm mx-auto p-4 bg-white text-black" style={{ fontFamily: 'monospace' }}>
      <div className="text-center border-b border-black pb-2 mb-4">
        <h1 className="text-lg font-bold">AZIZ WINES AND SPIRITS</h1>
        <p className="text-sm">Thank you for shopping with us!</p>
      </div>
      
      <div className="mb-4 text-sm">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{currentDate.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{currentDate.toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span>{sale.cashierName}</span>
        </div>
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span>{sale.id}</span>
        </div>
      </div>

      <div className="border-t border-b border-black py-2 mb-4">
        <div className="text-sm font-bold mb-2">ITEMS PURCHASED</div>
        {sale.items.map((item, index) => (
          <div key={index} className="text-sm mb-1">
            <div className="flex justify-between">
              <span>{item.productName}</span>
              <span>KSh {item.unitPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Qty: {item.quantity}</span>
              <span>KSh {item.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm mb-4">
        <div className="flex justify-between font-bold text-lg">
          <span>TOTAL:</span>
          <span>KSh {sale.totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Method:</span>
          <span className="uppercase">{sale.paymentMethod}</span>
        </div>
      </div>

      <div className="text-center text-xs border-t border-black pt-2">
        <p>Thank you for your business!</p>
        <p>Please come again</p>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';