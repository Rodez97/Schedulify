import {Navigate, Route, Routes} from "react-router-dom";
import AuthLogin from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";
import AuthRecover from "./AuthRecover";

export default function AuthPage() {
  return (
    <Routes>
      <Route path="login" element={<AuthLogin />} />
      <Route path="register" element={<AuthSignUp />} />
      <Route path="forgot-password" element={<AuthRecover />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
