import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./config/firebaseConfig";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";

// Create the root element
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Render the app
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Web vitals reporting
reportWebVitals();
