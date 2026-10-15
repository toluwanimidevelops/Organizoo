import { StrictMode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="228677396218-3ter8fohpdmm41kmaipbnl8dbkk9smqg.apps.googleusercontent.com">
    <BrowserRouter>
      <AppProvider>
        <Toaster />
        <App />
      </AppProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
