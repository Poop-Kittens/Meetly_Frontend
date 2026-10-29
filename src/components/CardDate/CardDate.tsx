import "./CardDate.css";
interface CardDateProps {
    date: string;
}

function CardDate({ date }: CardDateProps) {
    const now = new Date().getTime();
    const meetingTimestamp = Date.parse(date);
    const meetingdate = new Date(date);

    if (now > meetingTimestamp) {
        return (
            <div className="cardDate passed-date">
                <p>✔</p>
            </div>
        );
    }

    return (
        <div className="cardDate">
            <p>{meetingdate.toLocaleDateString("en-US", { month: "short" })}</p>
            <p>{meetingdate.getDate()}</p>
            <p>
                {meetingdate.toLocaleDateString("en-US", { weekday: "short" })}
            </p>
        </div>
    );
}

export default CardDate;
