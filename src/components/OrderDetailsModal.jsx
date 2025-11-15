// components/OrderDetailsModal.jsx
import { XMarkIcon, ShoppingBagIcon, MapPinIcon, PhoneIcon, CreditCardIcon, CurrencyRupeeIcon, UserIcon } from '@heroicons/react/24/outline';

const OrderDetailsModal = ({ order, onClose }) => {
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'text-green-600 bg-green-100';
    if (s === 'processing') return 'text-blue-600 bg-blue-100';
    if (s === 'shipped') return 'text-purple-600 bg-purple-100';
    if (s === 'cancelled') return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Not provided';
    const parts = [addr.address || addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Not provided';
  };

  const itemsTotal = (order.items || []).reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const total = itemsTotal + (order.taxAmount || 0) + (order.shippingCost || 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Order Details #{order.orderNumber || order._id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Order ID:</span>{' '}
              <span className="text-gray-900">#{order.orderNumber || order._id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date:</span>{' '}
              <span className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>{' '}
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {String(order.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Total Amount:</span>{' '}
              <span className="text-lg font-bold text-green-600">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" /> Customer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><span className="font-medium">Name:</span> {order.shippingAddress?.name || order.user?.name || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {order.shippingAddress?.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ShoppingBagIcon className="h-5 w-5 text-blue-600" /> Items
            </h3>
            <div className="space-y-3">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={item.product?.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} • Tier: {item.tier || 'Standard'}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-blue-600" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-700">{formatAddress(order.shippingAddress)}</p>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-blue-600" /> Payment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><span className="font-medium">Method:</span> {(order.paymentMethod || 'COD').toUpperCase()}</p>
              <p><span className="font-medium">Status:</span> <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>{order.paymentStatus || 'Pending'}</span></p>
              <p><span className="font-medium">Transaction ID:</span> {order.paymentId || 'N/A'}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Items Total</span> <span>₹{itemsTotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Tax</span> <span>₹{(order.taxAmount || 0).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Shipping</span> <span>₹{(order.shippingCost || 0).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span> <span className="text-green-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;