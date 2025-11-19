// components/LogoRequestsList.jsx – INDUSTRIAL MINIMAL 2025
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/api";
import {
  PaintBrushIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const LogoRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/api/custom-logo-requests/my-requests`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const list = data.data || data.requests || data || [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error("Failed to load logo requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "bg-green-100 text-green-700 border-green-200";
    if (s === "in-progress" || s === "in_progress")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "under-review" || s === "pending")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (s === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Custom Logo Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Track all your submitted branding requests.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center py-24">
          <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-orange-500 rounded-full"></div>
          <p className="text-gray-600 mt-4 text-sm">
            Loading your logo requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        // Empty State
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <PaintBrushIcon className="w-10 h-10 text-orange-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6">
            No Logo Requests Yet
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Start building your brand identity with a professional custom logo.
          </p>

          <a
            href="/custom-logo-request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white text-sm font-medium rounded-md mt-8 hover:bg-orange-700 transition"
          >
            <PaintBrushIcon className="w-5 h-5" />
            Create Logo Request
          </a>
        </div>
      ) : (
        // Requests Grid
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition cursor-pointer"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {req.businessName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium border ${getStatusBadge(
                    req.status
                  )}`}
                >
                  {req.status?.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              {/* Price */}
              <p className="text-xl font-semibold text-gray-800 mb-4">
                ₹{(req.estimatedPrice || req.price || 0).toLocaleString("en-IN")}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Industry</p>
                  <p className="font-medium text-gray-800">
                    {req.industry || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Package</p>
                  <p className="font-medium text-gray-800">
                    {req.packageType || req.selectedPackage || "Standard"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Style</p>
                  <p className="font-medium text-gray-800">
                    {req.designStyle || req.logoStyle || "Modern"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Colors</p>
                  <p className="font-medium text-gray-800 truncate">
                    {Array.isArray(req.colorPreferences)
                      ? req.colorPreferences.join(", ")
                      : req.colorPreferences || "Any"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => setSelectedRequest(req)}
                className="mt-6 w-full py-2.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* MODAL - INDUSTRIAL STYLE */}
      {/* ---------------------------------- */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-gray-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Logo Request Details
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedRequest.businessName}
                </h3>
                <p className="text-gray-500 mt-1">
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
                  {selectedRequest.status?.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Business Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Business Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong className="text-gray-700">Industry:</strong>{" "}
                      {selectedRequest.industry}
                    </p>
                    <p>
                      <strong className="text-gray-700">Package:</strong>{" "}
                      {selectedRequest.packageType ||
                        selectedRequest.selectedPackage}
                    </p>
                    {selectedRequest.website && (
                      <p>
                        <strong className="text-gray-700">Website:</strong>{" "}
                        <a
                          href={selectedRequest.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 underline"
                        >
                          {selectedRequest.website}
                        </a>
                      </p>
                    )}
                    <p>
                      <strong className="text-gray-700">Price:</strong>{" "}
                      <span className="font-semibold text-gray-900">
                        ₹
                        {(
                          selectedRequest.estimatedPrice ||
                          selectedRequest.price ||
                          0
                        ).toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Design Preferences */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Design Preferences
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong className="text-gray-700">Style:</strong>{" "}
                      {selectedRequest.designStyle ||
                        selectedRequest.logoStyle ||
                        "—"}
                    </p>
                    <p>
                      <strong className="text-gray-700">Colors:</strong>{" "}
                      {Array.isArray(selectedRequest.colorPreferences)
                        ? selectedRequest.colorPreferences.join(", ")
                        : selectedRequest.colorPreferences}
                    </p>
                    {selectedRequest.targetAudience && (
                      <p>
                        <strong className="text-gray-700">Audience:</strong>{" "}
                        {selectedRequest.targetAudience}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Brief */}
              {selectedRequest.description && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Project Brief
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedRequest.description}
                  </p>
                </div>
              )}

              {/* Reference Images */}
              {selectedRequest.referenceImages?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Reference Images
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRequest.referenceImages.map((img, i) => (
                      <img
                        key={i}
                        src={`${API_URL}${img}`}
                        alt="reference"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
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

export default LogoRequestsList;
