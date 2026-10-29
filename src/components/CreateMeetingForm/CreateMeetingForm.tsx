
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createMeeting, getCategories } from "../../api/api";
import type { CreateMeetingRequest, CategoryResponse } from "../../types/types";
import "./CreateMeetingForm.css";

type CreateMeetingFormProps = {
    onClose: () => void;
};

function CreateMeetingForm({ onClose }: CreateMeetingFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [maxAttendants, setMaxAttendants] = useState(10);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hämtar kategorier från backend när formuläret öppnas
    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const data = await getCategories();

                if (!cancelled) {
                    setCategories(data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Kunde inte hämta kategorier:", error);
                    setError("Kunde inte hämta kategorier.");
                }
            }
        }

        void loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    // Skapar ett nytt möte
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSaving) return;

        setError(null);

        if (!title.trim() || !location.trim()) {
            setError("Du måste ange titel och plats.");
            return;
        }

        const meetingDate = new Date(date);

        if (
            !date ||
            Number.isNaN(meetingDate.getTime()) ||
            meetingDate.getTime() <= Date.now()
        ) {
            setError("Välj ett datum och en tid i framtiden.");
            return;
        }

        if (!Number.isInteger(maxAttendants) || maxAttendants < 1) {
            setError("Ange minst en deltagare.");
            return;
        }

        if (selectedCategoryIds.length === 0) {
            setError("Välj minst en kategori.");
            return;
        }

        const meetingData: CreateMeetingRequest = {
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            date: meetingDate.toISOString(),
            maxAttendants,
            categoryIds: selectedCategoryIds,
        };

        try {
            setIsSaving(true);
            await createMeeting(meetingData);
            onClose();
        } catch (err) {
            console.error("Kunde inte skapa mötet:", err);
            setError("Kunde inte skapa mötet. Försök igen.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="create-meeting-overlay"
            onClick={() => {
                if (!isSaving) onClose();
            }}
        >
            <form
                className="create-meeting-form"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="create-meeting-header">
                    <h2>Skapa ett nytt möte</h2>

                    <button
                        type="button"
                        className="create-meeting-close"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Stäng formuläret"
                    >
                        ✕
                    </button>
                </div>

                <div className="create-meeting-content">
                    <label htmlFor="meeting-title">Titel</label>
                    <input
                        id="meeting-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ange mötets titel"
                        maxLength={50}
                        required
                    />

                    <label htmlFor="meeting-description">
                        Beskrivning
                    </label>
                    <textarea
                        id="meeting-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Beskriv vad mötet handlar om"
                        maxLength={300}
                    />

                    
<div className="create-meeting-row">
    <div className="create-meeting-field">
        <label htmlFor="meeting-location">Plats</label>
        <input
            id="meeting-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Var ska mötet hållas?"
            required
        />
    </div>

    <div className="create-meeting-field">
        <label htmlFor="meeting-date">Datum och tid</label>
        <input
            id="meeting-date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={(() => {
                const now = new Date();
                const localNow = new Date(
                    now.getTime() - now.getTimezoneOffset() * 60000,
                );
                return localNow.toISOString().slice(0, 16);
            })()}
            required
        />
    </div>

    <div className="create-meeting-field">
        <label htmlFor="meeting-max-attendants">
            Max antal deltagare
        </label>
        <input
            id="meeting-max-attendants"
            type="number"
            min="1"
            step="1"
            value={maxAttendants}
            onChange={(e) => setMaxAttendants(Number(e.target.value))}
            required
        />
    </div>
</div>


                    <fieldset>
                        <legend>Välj kategorier</legend>

                        {categories.map((category) => {
                            if (category.id === undefined) return null;

                            const categoryId = category.id;

                            return (
                                <label key={categoryId}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.includes(
                                            categoryId,
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCategoryIds(
                                                    (prev) => [
                                                        ...prev,
                                                        categoryId,
                                                    ],
                                                );
                                            } else {
                                                setSelectedCategoryIds(
                                                    (prev) =>
                                                        prev.filter(
                                                            (id) =>
                                                                id !==
                                                                categoryId,
                                                        ),
                                                );
                                            }
                                        }}
                                    />
                                    {category.title}
                                </label>
                            );
                        })}
                    </fieldset>

                    {error && <p role="alert">{error}</p>}

                    <div className="create-meeting-actions">
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? "Skapar möte..." : "Skapa möte"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Avbryt
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateMeetingForm;
