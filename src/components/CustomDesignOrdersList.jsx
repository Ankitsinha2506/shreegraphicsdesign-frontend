// CustomDesignOrdersList.jsx – INDUSTRIAL MINIMAL 2025
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/api";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const CustomDesignOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/custom-design-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const list = res.data.orders || res.data.data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error("Failed to fetch custom design orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed")
      return "bg-green-100 text-green-700 border-green-300";
    if (s === "in-progress")
      return "bg-blue-100 text-blue-700 border-blue-300";
    if (s === "pending")
      return "bg-amber-100 text-amber-700 border-amber-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Custom Design Orders
        </h1>
        <p className="text-gray-600 mt-2">
          Track your uploaded design orders and their progress.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-orange-500 rounded-full mx-auto"></div>
          <p className="text-sm text-gray-500 mt-4">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <PhotoIcon className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mt-6">
            No Custom Design Orders
          </h3>
          <p className="text-gray-500 mt-2">
            Upload custom designs to see your orders here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
            >
              {/* Header Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.product?.name || "Custom Design Order"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-xs font-medium border rounded-md ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {String(order.status)
                      .replace("-", " ")
                      .toUpperCase()}
                  </span>

                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ₹{(order.totalCost || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Order Details
                  </h4>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Design Type:</strong>{" "}
                    {order.designType}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Quantity:</strong>{" "}
                    {order.quantity}
                  </p>
                  {order.deliveryType && (
                    <p className="text-gray-600">
                      <strong className="text-gray-800">Delivery:</strong>{" "}
                      {order.deliveryType}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Design Placements
                  </h4>
                  {order.designPlacements?.length > 0 ? (
                    order.designPlacements.map((p, idx) => (
                      <p key={idx} className="text-gray-600">
                        {p.position}: {p.width}x{p.height}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">No placements specified</p>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              {order.specialInstructions && (
                <div className="mt-4 text-sm">
                  <p className="font-medium text-gray-800 mb-1">
                    Special Instructions
                  </p>
                  <p className="text-gray-600">{order.specialInstructions}</p>
                </div>
              )}

              {/* Uploaded Design */}
              {order.uploadedDesign && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    Uploaded Design
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={`${API_URL}${order.uploadedDesign.url}`}
                      alt="Uploaded"
                      className="h-20 w-20 rounded-md border border-gray-200 object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {order.uploadedDesign.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.uploadedDesign.fileType} •{" "}
                        {(order.uploadedDesign.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                >
                  View Details
                </button>

                {order.status === "completed" && order.finalDesigns && (
                  <button className="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition">
                    Download Final Design
                  </button>
                )}

                {order.status === "pending" && (
                  <button className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* MODAL — INDUSTRIAL MINIMAL */}
      {/* --------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full rounded-xl border border-gray-200 shadow-xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Custom Design Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <XMarkIcon className="h-5 w-5 text-gray-800" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedOrder.product?.name || "Custom Design"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Ordered on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <span
                  className={`mt-3 inline-block px-4 py-1.5 text-sm rounded-md border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {String(selectedOrder.status || "")
                    .replace("-", " ")
                    .toUpperCase()}
                </span>
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Order Info</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Design Type:</strong> {selectedOrder.designType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Quantity:</strong> {selectedOrder.quantity}
                  </p>
                  {selectedOrder.deliveryType && (
                    <p className="text-sm text-gray-700">
                      <strong>Delivery Type:</strong>{" "}
                      {selectedOrder.deliveryType}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    <strong>Total Cost:</strong> ₹
                    {selectedOrder.totalCost.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Design Placements
                  </h4>
                  {selectedOrder.designPlacements?.length > 0 ? (
                    selectedOrder.designPlacements.map((p, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        {p.position}: {p.width}x{p.height}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">
                      No placements specified
                    </p>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Special Instructions
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.specialInstructions}
                  </p>
                </div>
              )}

              {/* Uploaded Design */}
              {selectedOrder.uploadedDesign && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">
                    Uploaded Design
                  </h4>
                  <img
                    src={`${API_URL}${selectedOrder.uploadedDesign.url}`}
                    className="w-full max-h-72 object-contain rounded-lg border border-gray-200"
                    alt="Uploaded"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedOrder.uploadedDesign.originalName} •{" "}
                    {selectedOrder.uploadedDesign.fileType} •{" "}
                    {(selectedOrder.uploadedDesign.size / 1024 / 1024).toFixed(
                      2
                    )}{" "}
                    MB
                  </p>
                </div>
              )}

              {/* Close */}
              <div className="text-center pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDesignOrdersList;
