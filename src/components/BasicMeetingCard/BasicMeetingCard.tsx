import "../BasicMeetingCard/BasicMeetingCard.css";

interface BasicMeetingCardProps {
    date: string;
    categories: string[];
    title: string;
    location: string;
    remainingSlots: number;
}

function BasicMeetingCard({
    date,
    categories,
    title,
    location,
    remainingSlots,
}: BasicMeetingCardProps) {
    return (
        <div className="meetingCard">
            <p className="dateDisplay">{date}</p>

            {categories.map((category) => (
                <p key={category} className="categoryChip">
                    {category}
                </p>
            ))}

            <h1 className="title">{title}</h1>
            <p className="locationDisplay">{location}</p>
            <p className="remainingSpotsDisplay">{remainingSlots}</p>
        </div>
    );
}

export default BasicMeetingCard;
