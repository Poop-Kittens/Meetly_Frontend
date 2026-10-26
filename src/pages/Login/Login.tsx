import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { register, login, getCurrentUser, ApiError } from "../../api/api";
import type { LoginRequest, UserRegister } from "../../types/types";
import { useUser } from "../../hooks/useUser";
import "./Login.css";

import LoginForm from "../../components/LoginForm/LoginForm";
import MessageBox from "../../components/MessageBox/MessageBox";

function Login() {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <MessageBox message="Laddar användare..." messageType="none" />;
  }

  // om användaren redan är inloggad ska de inte kunna vara på login sidan
  if (user) {
    return <Navigate to="/home" replace />;
  }

  const logInAndEnter = async (request: LoginRequest) => {
    await login(request); // sets the cookie
    const loggedInUser = await getCurrentUser();
    setUser(loggedInUser);
    navigate("/home");
  };

  const handleLogin = async (request: LoginRequest) => {
    try {
      setError(null);
      await logInAndEnter(request);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Något gick fel.");
    }
  };

  const handleRegister = async (request: UserRegister) => {
    try {
      setError(null);
      await register(request);
      // Log in with the credentials the user just registered with
      await logInAndEnter({
        email: request.email ?? "",
        password: request.password ?? "",
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Något gick fel.");
    }
  };

  return (
    <div className="login-page">
      {error && <MessageBox message={error} messageType="error" />}
      <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );
}

export default Login;
