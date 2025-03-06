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
    <div className="App">
      <div className="card">
        <h2>Profile</h2>
        <p className="user-email">{auth.currentUser?.email}</p>

        <div className="button-group">
          <button
            className="change-password"
            onClick={() => setShowChangePasswordModal(true)}
          >
            Change Password
          </button>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Update Password</button>
            <button
              className="close-modal"
              onClick={() => setShowChangePasswordModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
