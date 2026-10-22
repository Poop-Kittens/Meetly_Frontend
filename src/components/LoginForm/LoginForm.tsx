import { useState, type SubmitEvent } from "react";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin: () => void;
  onRegister: () => void;
}

function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister();
    } else {
      onLogin();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>{isRegistering ? "Registrering" : "Välkommen tillbaka."}</h1>
      {isRegistering && (
        <label>
          Användarnamn
          <input
            type="text"
            placeholder="Jane Doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
      )}
      <label>
        Email
        <input
          type="email"
          placeholder="jane.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Lösenord
        <input
          type="password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          required
        />
      </label>
      <button
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
        className="register-btn"
      >
        {isRegistering
          ? "Tillbaka till login"
          : "Inget inlogg? Registrera dig här."}
      </button>
      <button type="submit" className="submit-btn">
        {isRegistering ? "Registrera dig" : "Logga in"}
      </button>
    </form>
  );
}

export default LoginForm;
