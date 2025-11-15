// 4. EmbroideryRequestsList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import { SwatchIcon } from '@heroicons/react/24/outline';

const EmbroideryRequestsList = () => {
  const [embroideryRequests, setEmbroideryRequests] = useState([]);
  const [embroideryRequestsLoading, setEmbroideryRequestsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchEmbroideryRequests();
  }, []);

  const fetchEmbroideryRequests = async () => {
    setEmbroideryRequestsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/custom-embroidery-requests/my-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data.data || [];
      setEmbroideryRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching embroidery requests:', error);
      toast.error('Failed to fetch embroidery requests');
      setEmbroideryRequests([]);
    } finally {
      setEmbroideryRequestsLoading(false);
    }
  };

  const btnPrimary = 'inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-[0_6px_25px_rgba(255,0,0,0.25)]';
  const btnSecondary = 'inline-flex items-center justify-center bg-transparent border border-red-800 text-red-300 py-2 px-4 rounded-lg hover:bg-red-900/20 transition';

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-300 mb-4">Custom Embroidery Requests</h2>

      {embroideryRequestsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-400">Loading embroidery requests...</p>
        </div>
      ) : embroideryRequests.length === 0 ? (
        <div className="text-center py-12">
          <SwatchIcon className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg text-gray-100">No embroidery requests</h3>
          <p className="mt-2 text-sm text-gray-400">Create one from the embroidery page.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {embroideryRequests.map(req => (
            <div key={req._id} className="bg-zinc-900 border border-red-900/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{req.businessName}</h3>
                  <p className="text-sm text-gray-400">Submitted on {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : req.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {String(req.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Type:</span> {req.embroideryType}</p>
                  <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Garment:</span> {req.garmentType}</p>
                  <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Placement:</span> {req.placement}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Quantity:</span> {req.quantity}</p>
                  <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Package:</span> {req.packageType}</p>
                  <p className="text-sm text-gray-400"><span className="font-medium text-gray-300">Price:</span> ₹{req.totalPrice}</p>
                </div>
              </div>

              {req.description && (
                <div className="mt-3 text-sm text-gray-400">
                  <div className="font-medium text-gray-300 mb-1">Description</div>
                  <div>{req.description}</div>
                </div>
              )}

              {req.referenceImages && req.referenceImages.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-gray-300 font-medium mb-2">Reference Images</div>
                  <div className="flex gap-2">
                    {req.referenceImages.slice(0, 4).map((img, idx) => (
                      <img key={idx} src={`${API_URL}${img}`} alt={`ref-${idx}`} className="h-16 w-16 object-cover rounded-md" />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelectedRequest(req)} className={`${btnSecondary} text-sm`}>View Details</button>
                {req.status === 'completed' && req.finalDesigns && <button className={`${btnPrimary} text-sm`}>Download Designs</button>}
                {req.status === 'in-progress' && <button className={`${btnSecondary} text-sm`}>Add Revision</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embroidery Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-zinc-950 border border-red-900/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6 max-w-3xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-300">Embroidery Request Details: {selectedRequest.businessName}</h2>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-red-300">✕</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()} • Status: <span className={`font-semibold px-2 py-1 rounded-full ${selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : selectedRequest.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{String(selectedRequest.status || '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">Request Details</h3>
                <p className="text-sm text-gray-400">Type: {selectedRequest.embroideryType}</p>
                <p className="text-sm text-gray-400">Garment: {selectedRequest.garmentType}</p>
                <p className="text-sm text-gray-400">Placement: {selectedRequest.placement}</p>
                <p className="text-sm text-gray-400">Quantity: {selectedRequest.quantity}</p>
                <p className="text-sm text-gray-400">Package: {selectedRequest.packageType}</p>
                <p className="text-sm text-gray-400">Total Price: ₹{selectedRequest.totalPrice.toLocaleString()}</p>
              </div>
            </div>
            {selectedRequest.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Description</h3>
                <p className="text-sm text-gray-400">{selectedRequest.description}</p>
              </div>
            )}
            {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Reference Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedRequest.referenceImages.map((img, idx) => (
                    <img key={idx} src={`${API_URL}${img}`} alt={`ref-${idx}`} className="h-32 w-full object-cover rounded-md" />
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedRequest(null)} className={btnSecondary}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbroideryRequestsList;