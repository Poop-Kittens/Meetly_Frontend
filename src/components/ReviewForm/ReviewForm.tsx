import { useState } from "react";
import "./ReviewForm.css";
import { reviewMeeting } from "../../api/api";

type ReviewFormProps = {
    meetingId: number;
};

function ReviewForm({ meetingId }: ReviewFormProps) {
    const [review, setReview] = useState("");

    const [grade, setGrade] = useState<number | null>(null);

    // Förhindrar att sidan laddas om när formuläret skickas
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        //tillfällig lösning
        //kontrollerar att användaren har valt ett betyg
        if (grade === null) {
            alert("Du måste välja ett betyg");
            return;
        }

        try {
            //skickar recensionen och betyget till backend
            await reviewMeeting(meetingId, { review, grade });

            //tömmer formuläret efter att recensionen skickats
            setReview("");
            setGrade(null);

            //visas när backend har tagit emot recensionen utan fel
            alert("Din recension har skickats!");
        } catch (error) {
            console.error("Kunde inte skicka recensionen:", error);
            alert("Något gick fel. Försök igen.");
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3>Skriv en recension</h3>

            <textarea
                placeholder="Vad tyckte du om mötet?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />

            <label htmlFor="grade">Betyg:</label>

            <select
                id="grade"
                value={grade ?? ""}
                onChange={(e) => setGrade(Number(e.target.value))}
            >
                <option value="" disabled>
                    Välj betyg
                </option>
                <option value="1">1 ⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </select>

            <button type="submit">Skicka recension</button>
        </form>
    );
}

export default ReviewForm;
