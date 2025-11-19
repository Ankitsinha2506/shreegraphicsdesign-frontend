// Settings.jsx – INDUSTRIAL MINIMAL 2025 UI
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/api";

const Settings = () => {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Industrial UI Styles
  const inputStyle =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition";

  const btnPrimary =
    "px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition text-sm font-medium";

  const btnSecondary =
    "px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm font-medium";

  const card =
    "bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        Account Settings
      </h1>

      {/* Change Password */}
      <div className={`${card} mb-10`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className={inputStyle}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className={card}>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Account Actions
        </h2>

        <div className="space-y-4">
          <button onClick={logout} className={`${btnSecondary} w-full`}>
            Sign Out
          </button>

          <button className="w-full px-4 py-2 rounded-md text-red-600 border border-red-300 hover:bg-red-50 transition text-sm font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
