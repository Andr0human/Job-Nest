import { lazy } from "react";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const PublicRoute = lazy(() => import("./PublicRoute"));

export { ProtectedRoute, PublicRoute };
