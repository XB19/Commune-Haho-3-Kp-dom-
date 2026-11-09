import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AdminApp from "./AdminApp.jsx";
import "./index.css";

// Application d'administration, servie sous /admin.
// Routeur « data » : permet d'avertir avant de quitter un formulaire non enregistré.
const router = createBrowserRouter([
  { path: "/admin/*", element: <AdminApp /> },
  { path: "*", element: <Navigate to="/admin" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
