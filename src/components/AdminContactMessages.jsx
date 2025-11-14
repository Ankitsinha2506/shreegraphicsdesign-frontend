import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { TrashIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/contact?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessages(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch contact messages:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIX: Search now automatically loads results + pagination also works
  useEffect(() => {
    fetchMessages();
  }, [page, search]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `/api/contact/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Marked as read");
      fetchMessages(); // refresh
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Message deleted");
      fetchMessages(); // refresh
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 to avoid empty results
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          📬 Contact Messages
        </h2>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row w-full sm:w-auto gap-2"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-64"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading / Empty States */}
      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No messages found.</p>
      ) : (
        <>
          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 border">Name</th>
                  <th className="px-3 py-2 border hidden md:table-cell">Email</th>
                  <th className="px-3 py-2 border hidden sm:table-cell">Project</th>
                  <th className="px-3 py-2 border">Subject</th>
                  <th className="px-3 py-2 border hidden sm:table-cell">Date</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg._id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 border font-medium">{msg.name}</td>

                    <td className="px-3 py-2 border hidden md:table-cell break-all">
                      {msg.email}
                    </td>

                    <td className="px-3 py-2 border hidden sm:table-cell">
                      {msg.projectType || "-"}
                    </td>

                    <td className="px-3 py-2 border max-w-[150px] truncate">
                      {msg.subject}
                    </td>

                    <td className="px-3 py-2 border hidden sm:table-cell">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-3 py-2 border text-center">
                      {msg.isRead ? (
                        <span className="text-green-600 font-medium">Read</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Unread</span>
                      )}
                    </td>

                    <td className="px-3 py-2 border text-center space-x-2">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-5 w-5 inline" />
                      </button>

                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border ${
                page <= 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "hover:bg-blue-600 hover:text-white border-blue-500"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-600 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page >= totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "hover:bg-blue-600 hover:text-white border-blue-500"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-lg shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedMessage(null)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              {selectedMessage.subject}
            </h3>

            <p className="text-sm text-gray-600 mb-1">
              From:{" "}
              <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
            </p>

            {selectedMessage.phone && (
              <p className="text-sm text-gray-600 mb-1">
                Phone: {selectedMessage.phone}
              </p>
            )}

            <p className="text-sm text-gray-600 mb-3">
              Project: {selectedMessage.projectType || "N/A"}
            </p>

            <hr className="my-3" />

            <p className="text-gray-700 whitespace-pre-wrap text-sm">
              {selectedMessage.message}
            </p>

            {!selectedMessage.isRead && (
              <button
                onClick={() => {
                  markAsRead(selectedMessage._id);
                  setSelectedMessage(null);
                }}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
