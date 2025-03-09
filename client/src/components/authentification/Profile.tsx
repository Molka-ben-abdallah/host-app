import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const Profile = () => {
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is still logged in:", user);
        navigate("/profile"); // Redirect if already logged in
      }
    });

    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    await signOut(auth);
    console.log("User logged out");
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
    console.log(auth.currentUser);
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
