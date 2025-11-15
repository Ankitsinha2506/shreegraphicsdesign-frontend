// OrdersList.jsx
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
    CurrencyRupeeIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersPagination, setOrdersPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        currentPage: 1,
        limit: 5,
    });
    const [ordersFilters, setOrdersFilters] = useState({
        status: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getPaymentMethod = () => {
  if (selectedOrder.paymentMethod)
    return selectedOrder.paymentMethod.replace(/_/g, " ");
  
  if (selectedOrder.paymentDetails?.cardLast4)
    return "card";

  if (selectedOrder.paymentDetails?.upiId)
    return "upi";

  return "cod"; // fallback
};


    /* -------------------------------------------------------------------------- */
    /*                                 FETCH ORDERS                               */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        fetchOrders(1);
    }, [ordersFilters]);

    const fetchOrders = async (page = 1) => {
        setOrdersLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(ordersPagination.limit || 5),
                ...(ordersFilters.status && { status: ordersFilters.status }),
                ...(ordersFilters.search && { search: ordersFilters.search }),
                sortBy: ordersFilters.sortBy,
                sortOrder: ordersFilters.sortOrder,
            });

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
                limit: data.limit || 5,
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

    /* -------------------------------------------------------------------------- */
    /*                                 UI HELPERS                                 */
    /* -------------------------------------------------------------------------- */
    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'delivered') return 'text-green-600 bg-green-100';
        if (s === 'processing') return 'text-blue-600 bg-blue-100';
        if (s === 'shipped') return 'text-purple-600 bg-purple-100';
        if (s === 'cancelled') return 'text-red-600 bg-red-100';
        return 'text-gray-600 bg-gray-100';
    };




    const formatAddress = (addr) => {
        if (!addr) return 'Not provided';
        const parts = [
            addr.street,
            addr.city,
            addr.state,
            addr.pincode,
        ].filter(Boolean);
        return parts.length ? parts.join(', ') : 'Not provided';
    };

    const btnPrimary =
        'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';
    const btnSecondary =
        'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition';

    /* -------------------------------------------------------------------------- */
    /*                                 RENDER                                     */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-red-300">Order History</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {ordersPagination.total > 0
                            ? `${ordersPagination.total} order${ordersPagination.total > 1 ? 's' : ''}`
                            : 'No orders yet'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 border border-red-900/20 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={ordersFilters.search}
                            onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
                    </div>

                    <select
                        value={ordersFilters.status}
                        onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={ordersFilters.sortBy}
                        onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                        <option value="createdAt">Date</option>
                        <option value="totalAmount">Amount</option>
                        <option value="status">Status</option>
                    </select>

                    <select
                        value={ordersFilters.sortOrder}
                        onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-red-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Loading / Empty */}
            {ordersLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-400">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12">
                    <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-600" />
                    <h3 className="mt-4 text-lg font-medium text-gray-200">No orders found</h3>
                    <p className="mt-2 text-sm text-gray-400">Browse products and place your first order.</p>
                </div>
            ) : (
                <>
                    {/* Order Cards */}
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-zinc-900 border border-red-900/20 rounded-lg p-4 hover:border-red-800/40 transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">
                                            Order #{order.orderNumber || order._id}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Placed on{' '}
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span
                                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {String(order.status || '')
                                                .replace('-', ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </span>
                                        <p className="text-lg font-bold text-gray-100 mt-1">
                                            ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Items preview (max 2 + "more") */}
                                <div className="space-y-3">
                                    {(order.items || []).slice(0, 2).map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <img
                                                src={
                                                    item.product?.images?.[0]?.url ||
                                                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=64&h=64&fit=crop'
                                                }
                                                alt={item.product?.name}
                                                className="h-12 w-12 object-cover rounded-md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-100 truncate">{item.product?.name || 'Product'}</p>
                                                <p className="text-xs text-gray-400">
                                                    Qty: {item.quantity} • Tier: {item.tier || 'Standard'}
                                                </p>
                                            </div>
                                            <p className="font-medium text-gray-100">
                                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                    {order.items?.length > 2 && (
                                        <p className="text-xs text-gray-400 text-center">
                                            + {order.items.length - 2} more item(s)
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className={`${btnSecondary} text-sm`}
                                    >
                                        View Details
                                    </button>
                                    {order.status === 'delivered' && (
                                        <button className={`${btnPrimary} text-sm`}>Reorder</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {ordersPagination.pages > 1 && (
                        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-gray-400">
                                Showing{' '}
                                {Math.min(
                                    (ordersPagination.currentPage - 1) * ordersPagination.limit + 1,
                                    ordersPagination.total
                                )}{' '}
                                to{' '}
                                {Math.min(
                                    ordersPagination.currentPage * ordersPagination.limit,
                                    ordersPagination.total
                                )}{' '}
                                of {ordersPagination.total} orders
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleOrdersPageChange(ordersPagination.currentPage - 1)}
                                    disabled={ordersPagination.currentPage === 1}
                                    className="p-2 rounded-md bg-zinc-900 border border-red-900/20 text-gray-300 disabled:opacity-50 hover:bg-red-900/10 transition"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </button>

                                {Array.from(
                                    { length: Math.min(5, ordersPagination.pages) },
                                    (_, i) => {
                                        let page;
                                        if (ordersPagination.pages <= 5) page = i + 1;
                                        else if (ordersPagination.currentPage <= 3) page = i + 1;
                                        else if (ordersPagination.currentPage >= ordersPagination.pages - 2)
                                            page = ordersPagination.pages - 4 + i;
                                        else page = ordersPagination.currentPage - 2 + i;
                                        return page > 0 && page <= ordersPagination.pages ? (
                                            <button
                                                key={page}
                                                onClick={() => handleOrdersPageChange(page)}
                                                className={`px-3 py-1 rounded-md text-sm transition ${page === ordersPagination.currentPage
                                                    ? 'bg-red-700 text-white'
                                                    : 'bg-zinc-900 border border-red-900/20 text-gray-300 hover:bg-red-900/10'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ) : null;
                                    }
                                ).filter(Boolean)}

                                <button
                                    onClick={() => handleOrdersPageChange(ordersPagination.currentPage + 1)}
                                    disabled={ordersPagination.currentPage === ordersPagination.pages}
                                    className="p-2 rounded-md bg-zinc-900 border border-red-900/20 text-gray-300 disabled:opacity-50 hover:bg-red-900/10 transition"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ==================== ORDER DETAILS MODAL ==================== */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-zinc-950 border border-red-900/30 rounded-xl shadow-2xl w-full max-w-4xl my-8 max-h-screen overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-zinc-950 border-b border-red-900/20 p-4 sm:p-6 flex justify-between items-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-red-300">
                                Order Details #{selectedOrder.orderNumber || selectedOrder._id}
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-red-300 transition text-2xl"
                                aria-label="Close"
                            >
                                times
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Basic info */}
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-sm">
                                <p className="text-gray-400">
                                    <span className="font-medium text-gray-300">Order ID:</span>{' '}
                                    #{selectedOrder.orderNumber || selectedOrder._id}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-medium text-gray-300">Placed on:</span>{' '}
                                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-300">Status:</span>
                                    <span
                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                            selectedOrder.status
                                        )}`}
                                    >
                                        {String(selectedOrder.status || '')
                                            .replace('-', ' ')
                                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                                    <ShoppingBagIcon className="h-5 w-5 text-red-400" />
                                    Order Items
                                </h3>
                                <div className="space-y-3">
                                    {(selectedOrder.items || []).map((item, i) => (
                                        <div key={i} className="flex gap-4 bg-zinc-900 p-4 rounded-lg">
                                            <img
                                                src={
                                                    item.product?.images?.[0]?.url ||
                                                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop'
                                                }
                                                alt={item.product?.name}
                                                className="h-20 w-20 object-cover rounded-md flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-100 truncate">{item.product?.name || 'Product'}</h4>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Qty: <span className="font-medium">{item.quantity}</span> • Tier:{' '}
                                                    <span className="font-medium">{item.tier || 'Standard'}</span>
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Price: <CurrencyRupeeIcon className="inline h-3 w-3" />
                                                    {(item.price || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-100">
                                                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-red-400" />
                                    Shipping Address
                                </h3>
                                <div className="bg-zinc-900 p-4 rounded-lg space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <UserIcon className="h-4 w-4 text-red-400" />
                                        <span className="font-medium">Name:</span>{' '}
                                        <span className="text-gray-200">{selectedOrder.shippingAddress?.fullName || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <PhoneIcon className="h-4 w-4 text-red-400" />
                                        <span className="font-medium">Phone:</span>{' '}
                                        <span className="text-gray-200">{selectedOrder.shippingAddress?.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-300">
                                        <MapPinIcon className="h-4 w-4 text-red-400 mt-0.5" />
                                        <span className="font-medium">Address:</span>{' '}
                                        <span className="text-gray-200">{formatAddress(selectedOrder.shippingAddress)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                                    <CreditCardIcon className="h-5 w-5 text-red-400" />
                                    Payment Details
                                </h3>
                                <div className="bg-zinc-900 p-4 rounded-lg space-y-2 text-sm">
                                    <p className="flex justify-between text-gray-300">
                                        <span className="font-medium">Method:</span>
                                        <span className="text-gray-200 capitalize">
                                            {getPaymentMethod()}
                                        </span>
                                    </p>

                                    <p className="flex justify-between text-gray-300">
                                        <span className="font-medium">Status:</span>
                                        <span
                                            className={`capitalize font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'
                                                }`}
                                        >
                                            {selectedOrder.paymentStatus || 'Pending'}
                                        </span>
                                    </p>
                                    <p className="flex justify-between text-gray-300">
                                        <span className="font-medium">Transaction ID:</span>
                                        <span className="text-gray-200 font-mono text-xs">
                                            {selectedOrder.paymentId || 'N/A'}
                                        </span>
                                    </p>
                                </div>
                            </div>


                            {/* Totals */}
                            {/* Price Breakdown */}
                            <div className="space-y-1 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>Items Total</span>
                                    <span>₹{(selectedOrder.items || []).reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>₹{(selectedOrder.taxAmount || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₹{(selectedOrder.shippingCost || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-gray-200 pt-1 border-t border-red-900/20">
                                    <span>Total</span>
                                    <span className="text-red-400">
                                        ₹{(() => {
                                            const items = (selectedOrder.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
                                            return (items + (selectedOrder.taxAmount || 0) + (selectedOrder.shippingCost || 0)).toLocaleString('en-IN');
                                        })()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button onClick={() => setSelectedOrder(null)} className={`${btnSecondary} w-full sm:w-auto`}>
                                    Close
                                </button>
                                {selectedOrder.status === 'delivered' && (
                                    <button className={`${btnPrimary} w-full sm:w-auto`}>Reorder</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;