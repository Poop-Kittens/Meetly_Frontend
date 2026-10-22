import "./Login.css";

import LoginForm from "../../components/LoginForm/LoginForm";

function Login() {
  const handleLogin = () => {
    console.log("Nu är du inloggad!");
    // lägg till hantering för api anrop
  };

  const handleRegister = () => {
    console.log("Nu är du registrerad!");
    // lägg till hantering för api anrop
  };

  return (
    <div className="login-page">
      <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );
}

export default Login;
