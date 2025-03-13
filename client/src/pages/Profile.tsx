import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, updatePassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();

 


  useEffect(() => {
    if (!currentUser) {
      console.log("user logged out");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 shadow-md flex justify-between items-center rounded-b-xl">
        <img src="/blackLogo.png" alt="Logo" className="h-14" />
        <div className="flex items-center space-x-3">
          {/* User Initial with Background Color */}
          <div className="w-10 h-10 bg-[#10455B] text-white flex items-center justify-center rounded-full font-bold">
            {auth.currentUser?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-800 font-medium">
            {auth.currentUser?.email?.split("@")[0]}
          </span>

          {/* Invisible "Change Password" Button with Border */}
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="px-4 py-2 border border-[#10455B] text-[#10455B] rounded-lg hover:bg-[#10455B] hover:text-white transition duration-300"
          >
            Change Password
          </button>

          {/* Logout Button with Icon */}
          <button
            onClick={handleLogout}
            className="bg-transparent hover:opacity-80"
          >
            <img src="/logout.png" alt="Logout" className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-6 space-y-6">
        {/* Welcome Section */}
        <section className="w-full bg-white py-6 px-8 shadow-md rounded-xl text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome, {auth.currentUser?.email?.split("@")[0]}!
          </h2>
          <p className="text-gray-600">Your hosting experience starts here.</p>

          {/* "Start Hosting" Button */}
          <button className="mt-4 px-6 py-3 default-color text-white font-bold rounded-lg shadow-md color-hover text-lg"
            onClick={() => navigate('/profile-information')}
          >
            Start Hosting
          </button>
        </section>

        {/* Recent Applications */}
        <section className="w-full bg-white py-6 px-8 shadow-md rounded-xl">
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
        </section>
      </main>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
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
