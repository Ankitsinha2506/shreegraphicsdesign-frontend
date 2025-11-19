// OrdersList.jsx - PREMIUM WHITE + ORANGE-RED THEME
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
    XMarkIcon,
    TruckIcon,
    QrCodeIcon,
} from '@heroicons/react/24/outline';

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

    const getPaymentMethod = (order) => {
        if (!order) return 'Unknown';
        const method = (order.paymentMethod || '').toString().trim().toLowerCase();

        if (method.includes('cod')) return 'Cash on Delivery';
        if (method.includes('upi')) return 'UPI Payment';
        if (method.includes('card')) return 'Card Payment';

        if (order.paymentDetails?.cardLast4) return 'Card Payment';
        if (order.paymentDetails?.upiId || order.transactionId) return 'UPI Payment';

        return order.paymentStatus === 'paid' ? 'Prepaid' : 'Cash on Delivery';
    };

    const getPaymentIcon = (method) => {
        if (method.includes('Cash on Delivery')) return <TruckIcon className="h-8 w-8 text-orange-600" />;
        if (method.includes('UPI')) return <QrCodeIcon className="h-8 w-8 text-orange-600" />;
        if (method.includes('Card')) return <CreditCardIcon className="h-8 w-8 text-orange-600" />;
        return <TruckIcon className="h-8 w-8 text-gray-500" />;
    };

    useEffect(() => {
        fetchOrders(1);
    }, [ordersFilters]);

    const fetchOrders = async (page = 1) => {
        setOrdersLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(ordersPagination.limit || 6),
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

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('delivered')) return 'bg-green-100 text-green-800 border-green-300';
        if (s.includes('processing') || s.includes('confirmed')) return 'bg-blue-100 text-blue-800 border-blue-300';
        if (s.includes('shipped')) return 'bg-purple-100 text-purple-800 border-purple-300';
        if (s.includes('cancelled')) return 'bg-red-100 text-red-800 border-red-300';
        return 'bg-orange-100 text-orange-800 border-orange-300';
    };

    const formatAddress = (addr) => {
        if (!addr) return 'Not provided';
        const parts = [
            addr.address || addr.street,
            addr.city,
            addr.state,
            addr.pincode,
        ].filter(Boolean);
        return parts.length ? parts.join(', ') : 'Not provided';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Your Orders
                    </h2>
                    <p className="text-gray-600 mt-3 text-lg">
                        {ordersPagination.total > 0
                            ? `Tracking ${ordersPagination.total} beautiful order${ordersPagination.total > 1 ? 's' : ''}`
                            : 'No orders yet — time to shop!'}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-200 p-6 mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-4 h-5 w-5 text-orange-600" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={ordersFilters.search}
                                onChange={(e) => handleOrdersFilterChange('search', e.target.value)}
                                className="w-full pl-12 pr-5 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition text-gray-800 placeholder-gray-500"
                            />
                        </div>

                        <select
                            value={ordersFilters.status}
                            onChange={(e) => handleOrdersFilterChange('status', e.target.value)}
                            className="px-5 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-gray-800"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={ordersFilters.sortBy}
                            onChange={(e) => handleOrdersFilterChange('sortBy', e.target.value)}
                            className="px-5 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-gray-800"
                        >
                            <option value="createdAt">Order Date</option>
                            <option value="totalAmount">Amount</option>
                        </select>

                        <select
                            value={ordersFilters.sortOrder}
                            onChange={(e) => handleOrdersFilterChange('sortOrder', e.target.value)}
                            className="px-5 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-gray-800"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Loading / Empty State */}
                {ordersLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin h-16 w-16 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-6 text-xl text-gray-600">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-2xl border-2 border-orange-200">
                        <ShoppingBagIcon className="h-24 w-24 text-orange-300 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-orange-600">No Orders Yet</h3>
                        <p className="text-gray-600 mt-4 text-lg">Your fashion journey starts now!</p>
                        <button
                            onClick={() => window.location.href = '/products'}
                            className="mt-8 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl rounded-full shadow-2xl transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden hover:shadow-3xl transition-all duration-300">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-2xl font-black">Order #{order.orderNumber || order._id.slice(-8)}</h3>
                                                <p className="text-orange-100">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <span className={`px-5 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                                                {order.status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Pending'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-4 mb-6">
                                            {(order.items || []).slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <img
                                                        src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                        alt={item.product?.name}
                                                        className="w-16 h-16 rounded-xl object-cover border-2 border-orange-200 shadow-md"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{item.product?.name || 'Product'}</p>
                                                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-xl text-orange-600 font-black">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {getPaymentIcon(getPaymentMethod(order))}
                                                <span className="font-bold text-gray-800">{getPaymentMethod(order)}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-orange-600">
                                                    ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-lg rounded-2xl shadow-xl transition"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {ordersPagination.pages > 1 && (
                            <div className="mt-12 flex justify-center gap-3">
                                <button
                                    onClick={() => handleOrdersPageChange(ordersPagination.currentPage - 1)}
                                    disabled={ordersPagination.currentPage === 1}
                                    className="p-4 rounded-2xl bg-white border-2 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition shadow-lg"
                                >
                                    <ChevronLeftIcon className="h-6 w-6 text-orange-600" />
                                </button>
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(5, ordersPagination.pages) }, (_, i) => {
                                        const page = ordersPagination.currentPage <= 3
                                            ? i + 1
                                            : ordersPagination.currentPage >= ordersPagination.pages - 2
                                                ? ordersPagination.pages - 4 + i
                                                : ordersPagination.currentPage - 2 + i;
                                        if (page < 1 || page > ordersPagination.pages) return null;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handleOrdersPageChange(page)}
                                                className={`w-12 h-12 rounded-2xl font-bold transition shadow-lg ${page === ordersPagination.currentPage
                                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                                                    : 'bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => handleOrdersPageChange(ordersPagination.currentPage + 1)}
                                    disabled={ordersPagination.currentPage === ordersPagination.pages}
                                    className="p-4 rounded-2xl bg-white border-2 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition shadow-lg"
                                >
                                    <ChevronRightIcon className="h-6 w-6 text-orange-600" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ORDER DETAILS MODAL */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-3xl shadow-3xl border-4 border-orange-300 w-full max-w-5xl max-h-screen overflow-y-auto">
                            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
                                <h2 className="text-3xl font-black">Order Details</h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white/20 rounded-full transition">
                                    <XMarkIcon className="h-8 w-8" />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-300 text-center">
                                        <p className="text-orange-700 font-bold">Order ID</p>
                                        <p className="text-2xl font-black text-orange-600 mt-2">#{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-300 text-center">
                                        <p className="text-orange-700 font-bold">Total Amount</p>
                                        <p className="text-4xl font-black text-red-600 mt-2">₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-300 text-center">
                                        <p className="text-orange-700 font-bold">Status</p>
                                        <span className={`inline-block px-6 py-3 rounded-full text-lg font-bold mt-2 ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status?.replace(/-/g, ' ').toUpperCase() || 'PENDING'}
                                        </span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="text-2xl font-black text-orange-600 mb-6 flex items-center gap-3">
                                        <ShoppingBagIcon className="h-8 w-8" /> Items Ordered
                                    </h3>
                                    <div className="space-y-5">
                                        {selectedOrder.items?.map((item, i) => (
                                            <div key={i} className="flex gap-6 bg-orange-50 p-6 rounded-2xl border-2 border-orange-200">
                                                <img
                                                    src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                    alt={item.product?.name}
                                                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-black text-gray-800">{item.product?.name}</h4>
                                                    <p className="text-gray-600 mt-2">Quantity: <strong>{item.quantity}</strong></p>
                                                    {item.customization?.size && <p className="text-orange-600">Size: {item.customization.size}</p>}
                                                    {item.customization?.color && <p className="text-orange-600">Color: {item.customization.color}</p>}
                                                </div>
                                                <p className="text-3xl font-black text-orange-600">
                                                    ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Address + Payment */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-orange-50 rounded-2xl p-8 border-2 border-orange-300">
                                        <h3 className="text-2xl font-black text-orange-600 mb-6 flex items-center gap-3">
                                            <MapPinIcon className="h-8 w-8" /> Delivery Address
                                        </h3>
                                        <div className="space-y-4 text-lg">
                                            <p className="flex items-center gap-4"><UserIcon className="h-6 w-6 text-orange-600" /> <strong>{selectedOrder.shippingAddress?.fullName}</strong></p>
                                            <p className="flex items-center gap-4"><PhoneIcon className="h-6 w-6 text-orange-600" /> {selectedOrder.shippingAddress?.phone}</p>
                                            <p className="flex items-start gap-4"><MapPinIcon className="h-6 w-6 text-orange-600 mt-1" /> {formatAddress(selectedOrder.shippingAddress)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 rounded-2xl p-8 border-2 border-orange-300">
                                        <h3 className="text-2xl font-black text-orange-600 mb-6 flex items-center gap-3">
                                            <CreditCardIcon className="h-8 w-8" /> Payment Information
                                        </h3>
                                        <div className="space-y-6 text-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Method:</span>
                                                <div className="flex items-center gap-4">
                                                    {getPaymentIcon(getPaymentMethod(selectedOrder))}
                                                    <strong className="text-xl text-gray-800">{getPaymentMethod(selectedOrder)}</strong>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Status:</span>
                                                <strong className={selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                                                    {selectedOrder.paymentStatus?.toUpperCase() || 'PENDING'}
                                                </strong>
                                            </div>
                                            {(selectedOrder.transactionId || selectedOrder.paymentId) && (
                                                <div className="bg-white p-4 rounded-xl border-2 border-orange-400">
                                                    <p className="text-sm text-orange-700 font-bold">Transaction ID</p>
                                                    <p className="text-xl font-black text-orange-600 tracking-wider">
                                                        {selectedOrder.transactionId || selectedOrder.paymentId}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center pt-6">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl rounded-full shadow-2xl transition"
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