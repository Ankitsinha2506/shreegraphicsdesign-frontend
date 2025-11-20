// OrdersList.jsx — Apple Minimal Industrial Theme
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  UserIcon,
  XMarkIcon,
  TruckIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

// ---------- PURE HELPERS (outside component) ----------

// Calculate subtotal from order items
const calculateSubtotal = (order) => {
  if (!order?.items) return 0;

  return order.items.reduce((sum, item) => {
    const price = item?.price ?? item?.product?.price ?? 0;
    const qty = item?.quantity ?? 1;
    return sum + price * qty;
  }, 0);
};

// Calculate one item's total
const safeItemTotal = (item) => {
  const price = item?.price ?? item?.product?.price ?? 0;
  const qty = item?.quantity ?? 1;
  return Number(price) * Number(qty);
};

// Safe number cast
const safeAmount = (value) => Number(value || 0);

// ---------- COMPONENT ----------

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    currentPage: 1,
    limit: 6,
  });
  const [ordersFilters, setOrdersFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ---------- Helpers ----------

  // Only COD + UPI (based on new backend paymentInfo)
  const getPaymentMethod = (order) => {
    if (!order?.paymentInfo) return 'Unknown';

    const info = order.paymentInfo;

    // If customer entered a manual UPI transaction ID
    if (info.manualTransactionId) {
      return 'UPI Payment';
    }

    const method = (info.method || '').toLowerCase();

    if (method === 'upi') return 'UPI Payment';
    if (method === 'cod' || method === 'cash-on-delivery') return 'Cash on Delivery';

    // Fallback (you only really use COD/UPI)
    return 'Cash on Delivery';
  };

  const getPaymentIcon = (order) => {
    const label = getPaymentMethod(order).toLowerCase();

    if (label.includes('upi')) {
      return <QrCodeIcon className="h-5 w-5 text-orange-500" />;
    }

    // Default → COD
    return <TruckIcon className="h-5 w-5 text-orange-500" />;
  };

  const getStatusPillClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 'bg-green-100 text-green-800 border-green-200';
    if (s.includes('processing') || s.includes('confirmed')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s.includes('shipped')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (s.includes('cancelled')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  // ---------- Data Fetch ----------

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersFilters]);

  const fetchOrders = async (page = 1) => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ordersPagination.limit || 6),
        sortBy: ordersFilters.sortBy,
        sortOrder: ordersFilters.sortOrder,
      });

      if (ordersFilters.status) params.append('status', ordersFilters.status);
      if (ordersFilters.search) params.append('search', ordersFilters.search);

      const { data } = await axios.get(`${API_URL}/api/orders?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const resOrders = data.orders || data.data || [];

      setOrders(resOrders);
      setOrdersPagination({
        page: data.page || page,
        pages: data.pages || data.totalPages || 1,
        total: data.total || data.count || resOrders.length,
        currentPage: data.page || page,
        limit: data.limit || 6,
      });
    } catch (err) {
      console.error('Fetch orders error:', err.response?.data || err);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOrdersFilterChange = (key, value) => {
    setOrdersFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleOrdersPageChange = (page) => {
    if (!page || page < 1 || page > ordersPagination.pages) return;
    fetchOrders(page);
  };

  // ---------- UI ----------

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Your Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {ordersPagination.total > 0
              ? `${ordersPagination.total} order${ordersPagination.total > 1 ? 's' : ''} found`
              : 'No orders found yet.'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={ordersFilters.search}
                onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Status */}
            <select
              value={ordersFilters.status}
              onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort by */}
            <select
              value={ordersFilters.sortBy}
              onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            >
              <option value="createdAt">Order Date</option>
              <option value="totalAmount">Amount</option>
            </select>

            {/* Sort order */}
            <select
              value={ordersFilters.sortOrder}
              onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Loading / Empty / List */}
        {ordersLoading ? (
          <div className="py-20 text-center">
            <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-sm text-gray-500">Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm py-16 flex flex-col items-center justify-center text-center">
            <ShoppingBagIcon className="h-10 w-10 text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Once you place an order, it will appear here.
            </p>
            <button
              onClick={() => (window.location.href = '/products')}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Browse products
            </button>
          </div>
        ) : (
          <>
            {/* Orders grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {orders.map((order) => {
                const totalLabel = safeAmount(order.totalAmount).toLocaleString('en-IN');

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4"
                  >
                    {/* Top row */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.orderNumber || order._id?.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                            : '—'}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${getStatusPillClass(
                          order.status
                        )}`}
                      >
                        {order.status
                          ? order.status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                          : 'Pending'}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="space-y-2 mb-3">
                      {(order.items || []).slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <img
                            src={
                              item.product?.images?.[0]?.url ||
                              item.product?.image ||
                              '/placeholder.jpg'
                            }
                            alt={item.product?.name || 'Product'}
                            className="w-10 h-10 rounded-md border border-gray-200 object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900 line-clamp-1">
                              {item.product?.name || 'Product'}
                            </p>

                            {/* Color + Size preview (if exists) */}
                            {(item.customization?.color || item.customization?.size) && (
                              <p className="text-[11px] text-gray-500">
                                {item.customization?.color && (
                                  <span className="capitalize">{item.customization.color}</span>
                                )}
                                {item.customization?.size && (
                                  <span className="ml-1">• {item.customization.size}</span>
                                )}
                              </p>
                            )}

                            <p className="text-[11px] text-gray-500">
                              Qty: {item.customization?.quantity || item.quantity || 1}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <p className="text-[11px] text-gray-500">
                          +{order.items.length - 2} more item
                          {order.items.length - 2 > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Bottom row */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        {getPaymentIcon(order)}
                        <span>{getPaymentMethod(order)}</span>
                      </div>
                      {/* If you want to show card total, uncomment below */}
                      {/* <p className="text-base font-semibold text-gray-900">₹{totalLabel}</p> */}
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="mt-3 w-full inline-flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-xs font-medium text-gray-800 rounded-md py-2 transition"
                    >
                      View details
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {ordersPagination.pages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2 text-sm">
                <button
                  onClick={() => handleOrdersPageChange(ordersPagination.currentPage - 1)}
                  disabled={ordersPagination.currentPage === 1}
                  className="p-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-700" />
                </button>

                {Array.from(
                  { length: Math.min(5, ordersPagination.pages) },
                  (_, i) => {
                    const page =
                      ordersPagination.currentPage <= 3
                        ? i + 1
                        : ordersPagination.currentPage >= ordersPagination.pages - 2
                          ? ordersPagination.pages - 4 + i
                          : ordersPagination.currentPage - 2 + i;

                    if (page < 1 || page > ordersPagination.pages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => handleOrdersPageChange(page)}
                        className={`px-3 py-1 rounded-md border text-xs font-medium ${page === ordersPagination.currentPage
                          ? 'bg-orange-500 text:white border-orange-500'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() => handleOrdersPageChange(ordersPagination.currentPage + 1)}
                  disabled={ordersPagination.currentPage === ordersPagination.pages}
                  className="p-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100"
                >
                  <ChevronRightIcon className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            {/* ---- CALCULATE TOTAL FOR MODAL ---- */}
            {(() => {
              const modalSubtotal = calculateSubtotal(selectedOrder);
              const modalTax = Math.round(modalSubtotal * 0.18);
              const modalShipping = Number(selectedOrder.shippingAmount ?? 0);
              const modalTotal = modalSubtotal + modalTax + modalShipping;

              // Save these values into the selectedOrder object (so you can use it anywhere)
              selectedOrder._modalSubtotal = modalSubtotal;
              selectedOrder._modalTax = modalTax;
              selectedOrder._modalShipping = modalShipping;
              selectedOrder._modalTotal = modalTotal;
            })()}
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-3xl max-h-full overflow-y-auto">
              {/* Modal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Order details</h2>
                  <p className="text-xs text-gray-500">
                    Order #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded hover:bg-gray-100"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="px-4 sm:px-6 py-5 space-y-6 text-sm text-gray-800">
                {/* Summary row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                      Order ID
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                      Total amount
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ₹{selectedOrder._modalTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium mt-1 ${getStatusPillClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status
                        ? selectedOrder.status
                          .replace(/-/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                        : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Items
                  </h3>
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 bg-gray-50 border border-gray-200 rounded-md p-3"
                      >
                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            item.product?.image ||
                            '/placeholder.jpg'
                          }
                          alt={item.product?.name || 'Product'}
                          className="w-14 h-14 rounded-md border border-gray-200 object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product?.name || 'Product'}
                          </p>

                          {(item.customization?.color || item.customization?.size) && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.customization?.color && (
                                <span className="capitalize">{item.customization.color}</span>
                              )}
                              {item.customization?.size && (
                                <span className="ml-1">• Size: {item.customization.size}</span>
                              )}
                            </p>
                          )}

                          <p className="text-xs text-gray-500">
                            Qty: {item.customization?.quantity || item.quantity || 1}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{safeItemTotal(item).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Delivery address
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                        {selectedOrder.shippingAddress?.fullName || 'Customer'}
                      </p>
                      {selectedOrder.shippingAddress?.phone && (
                        <p className="flex items-center gap-2 text-xs text-gray-700">
                          <PhoneIcon className="h-4 w-4 text-gray-500" />
                          {selectedOrder.shippingAddress.phone}
                        </p>
                      )}
                      <p className="flex items-start gap-2 text-xs text-gray-700">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span>
                          {selectedOrder.shippingAddress?.street}
                          <br />
                          {selectedOrder.shippingAddress?.city},{' '}
                          {selectedOrder.shippingAddress?.state}
                          {selectedOrder.shippingAddress?.zipCode
                            ? ` – ${selectedOrder.shippingAddress.zipCode}`
                            : ''}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Payment
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        {getPaymentIcon(selectedOrder)}
                        <span className="font-medium">{getPaymentMethod(selectedOrder)}</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        Status:{' '}
                        <span className="font-medium text-gray-800">
                          {(selectedOrder.paymentInfo?.paymentStatus || 'pending')
                            .toString()
                            .toUpperCase()}
                        </span>
                      </p>

                      {/* SHOW UPI TRANSACTION ID IF EXISTS */}
                      {selectedOrder.paymentInfo?.manualTransactionId && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                            UPI Transaction ID
                          </p>
                          <p className="text-xs font-mono font-bold text-emerald-900 mt-1 break-all">
                            {selectedOrder.paymentInfo.manualTransactionId}
                          </p>
                          <p className="text-[10px] text-emerald-700 mt-1">
                            Payment under verification
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>



                {/* Summary (Subtotal + GST + Shipping + Total) */}
                <div className="border-t border-gray-200 pt-4">
                  {(() => {
                    const subtotal = calculateSubtotal(selectedOrder);
                    const tax = Math.round(subtotal * 0.18); // 18% GST
                    const shipping = Number(selectedOrder.shippingAmount ?? 0);
                    const total = subtotal + tax + shipping;

                    return (
                      <>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span>GST (18%)</span>
                          <span>₹{tax.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span>Shipping</span>
                          <span>₹{shipping.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between text-sm font-semibold text-gray-900 mt-2">
                          <span>Total paid</span>
                          <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Close */}
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-800 hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersList;
