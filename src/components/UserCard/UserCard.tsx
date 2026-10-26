import type { UserResponse } from "../../types/types";
import { useUser } from "../../hooks/useUser";
import { logout } from "../../api/api";
import "./UserCard.css";
import { useNavigate } from "react-router";

interface UserCardProps {
  user: UserResponse;
}

function UserCard({ user }: UserCardProps) {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const initial = (user.userName ?? "").charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="user-card">
      <div className="card-top">
        <div className="user-card__avatar" aria-hidden="true">
          {initial}
        </div>
        <div className="user-card__info">
          <h2 className="user-card__name">{user.userName}</h2>
          <p className="user-card__email">{user.email}</p>
        </div>
      </div>
      <hr />
      <div className="card-bottom">
        <p>Your personal account</p>
        <button className="logout-btn" onClick={handleLogout}>
          ➜] Log out
        </button>
      </div>
    </div>
  );
}

export default UserCard;
