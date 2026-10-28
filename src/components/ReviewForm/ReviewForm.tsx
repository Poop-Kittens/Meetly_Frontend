import { useState } from "react";
import "./ReviewForm.css";
import { reviewMeeting } from "../../api/api";

type ReviewFormProps = {
    meetingId: number;
    onClose: () => void;
};

function ReviewForm({ meetingId, onClose }: ReviewFormProps) {
    const [review, setReview] = useState("");
    const [grade, setGrade] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Förhindrar att sidan laddas om när formuläret skickas
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        //tillfällig lösning
        //kontrollerar att användaren har valt ett betyg
        if (grade === null) {
            setError("Du måste välja ett betyg");
            return;
        }

        try {
            setError(null);
            //skickar recensionen och betyget till backend
            await reviewMeeting(meetingId, { review, grade });

            //tömmer formuläret efter att recensionen skickats
            // setReview("");
            // setGrade(null);

            onClose(); //Stänger formuläret när recensionen har sparats.

            //visas när backend har tagit emot recensionen utan fel
            //   alert("Din recension har skickats!");
        } catch (err) {
            console.error("Kunde inte skicka recensionen:", err);
            setError("Något gick fel. Försök igen.");
        }
    };

    return (
        <div className="review-overlay" onClick={onClose}>
            <form
                className="review-form"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()} //Klick i formuläret ska inte stänga det.
            >
                <div className="review-modal-header">
                    <h3>Skriv en recension</h3>

                    <button
                        type="button"
                        className="review-close"
                        onClick={onClose}
                        aria-label="Stäng recensionsformuläret"
                    >
                        ✕
                    </button>
                </div>

                <div className="review-body">
                    <div className="review-field">
                        <label htmlFor="review-text">Din recension</label>
                        <textarea
                            id="review-text"
                            placeholder="Vad tyckte du om mötet?"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>

                    <div className="review-field">
                        <label htmlFor="grade">Betyg</label>
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
                    </div>

                    {error && (
                        <p className="review-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="review-actions">
                        <button
                            type="button"
                            className="review-cancel"
                            onClick={onClose}
                        >
                            Avbryt
                        </button>
                        <button type="submit">Skicka recension</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;
