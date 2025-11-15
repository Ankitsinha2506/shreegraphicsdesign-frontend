// 5. CustomDesignOrdersList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import { PhotoIcon } from '@heroicons/react/24/outline';

const CustomDesignOrdersList = () => {
  const [customDesignOrders, setCustomDesignOrders] = useState([]);
  const [customDesignOrdersLoading, setCustomDesignOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchCustomDesignOrders();
  }, []);

  const fetchCustomDesignOrders = async () => {
    setCustomDesignOrdersLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/custom-design-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data.orders || response.data.data || [];
      setCustomDesignOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching custom design orders:', error);
      toast.error('Failed to fetch custom design orders');
      setCustomDesignOrders([]);
    } finally {
      setCustomDesignOrdersLoading(false);
    }
  };

  const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';
  const btnSecondary = 'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition';

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-300 mb-4">Custom Design Orders</h2>

      {customDesignOrdersLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-400">Loading orders...</p>
        </div>
      ) : customDesignOrders.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg text-gray-100">No custom design orders</h3>
          <p className="mt-2 text-sm text-gray-400">Upload and order custom designs to see them here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {customDesignOrders.map(order => (
            <div key={order._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{order.product?.name || 'Custom Design Order'}</h3>
                  <p className="text-sm text-gray-400">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'completed' ? 'text-green-600 bg-green-100' : order.status === 'in-progress' ? 'text-blue-600 bg-blue-100' : order.status === 'pending' ? 'text-yellow-600 bg-yellow-100' : 'text-gray-600 bg-gray-100'}`}>
                    {String(order.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <p className="text-lg font-bold text-gray-100 mt-1">₹{order.totalCost?.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-300 font-medium mb-1">Order Details</div>
                  <p className="text-sm text-gray-400">Design Type: {order.designType}</p>
                  <p className="text-sm text-gray-400">Quantity: {order.quantity}</p>
                  {order.deliveryType && <p className="text-sm text-gray-400">Delivery: {order.deliveryType}</p>}
                </div>

                <div>
                  <div className="text-sm text-gray-300 font-medium mb-1">Design Placements</div>
                  {order.designPlacements && order.designPlacements.length > 0 ? (
                    order.designPlacements.map((placement, idx) => (
                      <p key={idx} className="text-sm text-gray-400">{placement.position}: {placement.width}x{placement.height}</p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No placements specified</p>
                  )}
                </div>
              </div>

              {order.specialInstructions && (
                <div className="mt-3 text-sm text-gray-400">
                  <div className="font-medium text-gray-300 mb-1">Special Instructions</div>
                  <div>{order.specialInstructions}</div>
                </div>
              )}

              {order.uploadedDesign && (
                <div className="mt-3">
                  <div className="text-sm text-gray-300 font-medium mb-2">Uploaded Design</div>
                  <div className="flex items-center gap-3">
                    <img src={`${API_URL}${order.uploadedDesign.url}`} alt="Uploaded design" className="h-20 w-20 object-cover rounded-md" />
                    <div>
                      <div className="text-sm font-medium text-gray-100">{order.uploadedDesign.originalName}</div>
                      <div className="text-xs text-gray-400">{order.uploadedDesign.fileType} • {(order.uploadedDesign.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelectedOrder(order)} className={`${btnSecondary} text-sm`}>View Details</button>
                {order.status === 'completed' && order.finalDesigns && <button className={`${btnPrimary} text-sm`}>Download Final Design</button>}
                {order.status === 'pending' && <button className={`${btnSecondary} text-sm`}>Cancel Order</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Design Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-zinc-950 border border-red-900/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6 max-w-3xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-300">Custom Design Order Details: {selectedOrder.product?.name || 'Custom Design'}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-300">✕</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString()} • Status: <span className={`font-semibold px-2 py-1 rounded-full ${selectedOrder.status === 'completed' ? 'text-green-600 bg-green-100' : selectedOrder.status === 'in-progress' ? 'text-blue-600 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>{String(selectedOrder.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">Order Details</h3>
                <p className="text-sm text-gray-400">Design Type: {selectedOrder.designType}</p>
                <p className="text-sm text-gray-400">Quantity: {selectedOrder.quantity}</p>
                {selectedOrder.deliveryType && <p className="text-sm text-gray-400">Delivery Type: {selectedOrder.deliveryType}</p>}
                <p className="text-sm text-gray-400">Total Cost: ₹{selectedOrder.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">Design Placements</h3>
                {selectedOrder.designPlacements && selectedOrder.designPlacements.length > 0 ? (
                  selectedOrder.designPlacements.map((placement, idx) => (
                    <p key={idx} className="text-sm text-gray-400">{placement.position}: {placement.width}x{placement.height}</p>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No placements specified</p>
                )}
              </div>
            </div>
            {selectedOrder.specialInstructions && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Special Instructions</h3>
                <p className="text-sm text-gray-400">{selectedOrder.specialInstructions}</p>
              </div>
            )}
            {selectedOrder.uploadedDesign && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Uploaded Design</h3>
                <img src={`${API_URL}${selectedOrder.uploadedDesign.url}`} alt="Uploaded design" className="h-64 w-auto object-contain rounded-md" />
                <p className="text-sm text-gray-400 mt-2">{selectedOrder.uploadedDesign.originalName} ({selectedOrder.uploadedDesign.fileType}, {(selectedOrder.uploadedDesign.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className={btnSecondary}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDesignOrdersList;