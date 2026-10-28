import type { MeetingResponse } from "../../types/types";
import "./ReviewList.css";

interface ReviewListProps {
    participants: NonNullable<MeetingResponse["participants"]>;
}

function ReviewList({ participants }: ReviewListProps) {
    // Bara deltagare som har lämnat recension eller betyg:
    const reviews = participants.filter((p) => p.review || p.grade);

    if (reviews.length === 0) {
        return <p className="review-list-empty">Inga recensioner ännu.</p>;
    }

    return (
        <>
            <ul className="review-list">
                {reviews.map((p) => (
                    <li key={p.userName} className="review-list-item">
                        <strong>{p.userName}</strong>
                        {p.grade && <span> {"⭐".repeat(p.grade)}</span>}
                        {p.review && <p>{p.review}</p>}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ReviewList;
