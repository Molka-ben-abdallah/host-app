import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, updatePassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const Profile = () => {
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  const handleChangePassword = async () => {
    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        setSuccessMessage("Password updated successfully!");
        setShowChangePasswordModal(false);
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="mb-6 mx-auto" />
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
            FN
          </div>
          <span className="text-gray-800 font-medium">
            {auth.currentUser?.email}
          </span>
          <button className="text-red-500 text-xl" onClick={handleLogout}>
            ⏻
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full max-w-4xl bg-white p-6 mt-6 rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {auth.currentUser?.email}!
        </h2>
        <p className="text-gray-600">Your hosting experience starts here.</p>
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
          onClick={() => setShowChangePasswordModal(true)}
        >
          Change Password
        </button>
      </div>

      {/* Recent Applications */}
      <div className="w-full max-w-4xl bg-white p-6 mt-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h3>
          <a href="#" className="text-blue-500 hover:underline">
            View all
          </a>
        </div>
        <div className="h-20 flex items-center justify-center text-gray-400">
          No recent applications.
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mt-4 p-2 border rounded-lg"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
                onClick={handleChangePassword}
              >
                Update Password
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
                onClick={() => setShowChangePasswordModal(false)}
              >
                Cancel
              </button>
            </div>
            {successMessage && (
              <p className="text-green-500 mt-2">{successMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
