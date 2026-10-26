import "../CardDate/CardDate.css";
interface CardDateProps {
  date: string;
}

function CardDate({ date }: CardDateProps) {
  const meetingdate = new Date(date);
  return (
    <div className="cardDate">
      <p>{meetingdate.toLocaleDateString("en-US", { month: "short" })}</p>
      <p>{meetingdate.getDate()}</p>
      <p>{meetingdate.toLocaleDateString("en-US", { weekday: "short" })}</p>
    </div>
  );
}

export default CardDate;
