import { useState } from "react";
import { useNavigate } from "react-router";
import { register, login, getCurrentUser, ApiError } from "../../api/api";
import type { LoginRequest, UserRegister } from "../../types/types";
import { useUser } from "../../context/UserContext";
import "./Login.css";

import LoginForm from "../../components/LoginForm/LoginForm";

function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (request: LoginRequest) => {
    try {
      setError(null);
      await login(request);
      const loggedInUser = await getCurrentUser();
      setUser(loggedInUser);
      navigate("/home");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Något gick fel.");
    }
  };

  const handleRegister = async (request: UserRegister) => {
    try {
      setError(null);
      await register(request);
      // either log in automatically or switch the form back to login mode
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Något gick fel.");
    }
  };

  return (
    <div className="login-page">
      {error ? (
        <p>{error}</p>
      ) : (
        <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}

export default Login;
