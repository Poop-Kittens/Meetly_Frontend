import type { UserResponse } from "../../types/types";
import "./UserCard.css";

interface UserCardProps {
  user: UserResponse;
}

function UserCard({ user }: UserCardProps) {
  const initial = user.userName ?? "".charAt(0).toUpperCase();

  return (
    <div className="user-card">
      <div className="user-card__avatar" aria-hidden="true">
        {initial}
      </div>
      <div className="user-card__info">
        <h2 className="user-card__name">{user.userName}</h2>
        <p className="user-card__email">{user.email}</p>
      </div>
    </div>
  );
}

export default UserCard;
