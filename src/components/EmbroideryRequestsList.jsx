// EmbroideryRequestsList.jsx – INDUSTRIAL MINIMAL 2025
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/api";
import { SwatchIcon, XMarkIcon } from "@heroicons/react/24/outline";

const EmbroideryRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchEmbroideryRequests();
  }, []);

  const fetchEmbroideryRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/custom-embroidery-requests/my-requests`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const list = res.data.data || [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error("Failed to fetch embroidery requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "pending")
      return "bg-amber-100 text-amber-700 border-amber-300";
    if (s === "in-progress")
      return "bg-blue-100 text-blue-700 border-blue-300";
    if (s === "completed")
      return "bg-green-100 text-green-700 border-green-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Custom Embroidery Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Track all your embroidery custom orders.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-orange-500 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">
            Loading embroidery requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <SwatchIcon className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mt-6">
            No Embroidery Requests
          </h3>
          <p className="text-gray-500 mt-2">
            Create your first custom embroidery request.
          </p>
        </div>
      ) : (
        /* Requests List */
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {req.businessName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Submitted on{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-md border ${getStatusBadge(
                    req.status
                  )}`}
                >
                  {String(req.status || "")
                    .replace("-", " ")
                    .toUpperCase()}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-gray-500">
                    <strong className="text-gray-800">Type:</strong>{" "}
                    {req.embroideryType}
                  </p>
                  <p className="text-gray-500">
                    <strong className="text-gray-800">Garment:</strong>{" "}
                    {req.garmentType}
                  </p>
                  <p className="text-gray-500">
                    <strong className="text-gray-800">Placement:</strong>{" "}
                    {req.placement}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    <strong className="text-gray-800">Quantity:</strong>{" "}
                    {req.quantity}
                  </p>
                  <p className="text-gray-500">
                    <strong className="text-gray-800">Package:</strong>{" "}
                    {req.packageType}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Price: ₹{(req.totalPrice || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Description */}
              {req.description && (
                <div className="mt-4 text-sm">
                  <p className="font-medium text-gray-800 mb-1">
                    Description
                  </p>
                  <p className="text-gray-600">{req.description}</p>
                </div>
              )}

              {/* Reference Images */}
              {req.referenceImages?.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-800 text-sm mb-2">
                    Reference Images
                  </p>
                  <div className="flex gap-2">
                    {req.referenceImages.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={`${API_URL}${img}`}
                        alt="ref"
                        className="h-16 w-16 rounded-md border border-gray-200 object-cover"
                      />
                    ))}
                    {req.referenceImages.length > 4 && (
                      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-700 text-sm font-medium">
                        +{req.referenceImages.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* MODAL – INDUSTRIAL STYLE */}
      {/* ---------------------------------- */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl border border-gray-200 shadow-xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Embroidery Request Details
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <XMarkIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedRequest.businessName}
                </h3>
                <p className="text-gray-500 mt-1 text-sm">
                  Submitted on{" "}
                  {new Date(selectedRequest.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <span
                  className={`inline-block mt-3 px-4 py-1.5 rounded-md text-sm font-medium border ${getStatusBadge(
                    selectedRequest.status
                  )}`}
                >
                  {String(selectedRequest.status || "")
                    .replace("-", " ")
                    .toUpperCase()}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Request Information
                  </h4>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Type:</strong> {selectedRequest.embroideryType}
                    </p>
                    <p>
                      <strong>Garment:</strong> {selectedRequest.garmentType}
                    </p>
                    <p>
                      <strong>Placement:</strong> {selectedRequest.placement}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {selectedRequest.quantity}
                    </p>
                    <p>
                      <strong>Package:</strong> {selectedRequest.packageType}
                    </p>
                    <p>
                      <strong>Total Price:</strong>{" "}
                      ₹{(selectedRequest.totalPrice || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedRequest.description && (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Description
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedRequest.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Reference Images */}
              {selectedRequest.referenceImages?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Reference Images
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRequest.referenceImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${API_URL}${img}`}
                        alt="ref"
                        className="w-full h-40 border border-gray-200 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Close */}
              <div className="pt-4 text-center">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-6 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 transition"
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

export default EmbroideryRequestsList;
