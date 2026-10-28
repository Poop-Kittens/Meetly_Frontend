import {
    useRef,
    useEffect,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { getCategories } from "../../api/api";
import type { CategoryResponse, MeetingSearchRequest } from "../../types/types";
import "./SearchForm.css";

interface SearchFormProps {
    onSearch: (request: MeetingSearchRequest) => void;
}

const DEBOUNCE_MS = 400;

const emptySearchRequest: MeetingSearchRequest = {
    SearchTerm: "",
    Location: "",
    Date: "",
    Category: "",
};

function SearchForm({ onSearch }: SearchFormProps) {
    const [searchRequest, setSearchRequest] =
        useState<MeetingSearchRequest>(emptySearchRequest);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        let cancelled = false;

        getCategories()
            .then((data) => {
                if (!cancelled) setCategories(data);
            })
            .catch((e) => {
                console.error("Kunde inte hämta kategorier:", e);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelPendingSearch = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        const next = { ...searchRequest, [name]: value };
        setSearchRequest(next);

        cancelPendingSearch();
        timeoutRef.current = setTimeout(() => onSearch(next), DEBOUNCE_MS);
    };

    const handleSearch = (e: SubmitEvent) => {
        e.preventDefault();
        cancelPendingSearch();
        onSearch(searchRequest);
    };

    const handleClear = () => {
        cancelPendingSearch();
        setSearchRequest(emptySearchRequest);
        onSearch(emptySearchRequest);
    };

    return (
        <form onSubmit={handleSearch} className="search-form">
            <label>
                Sökning
                <input
                    type="text"
                    name="SearchTerm"
                    placeholder="Sökord"
                    value={searchRequest.SearchTerm}
                    onChange={handleChange}
                />
            </label>
            <label>
                Plats
                <input
                    type="text"
                    name="Location"
                    placeholder="Plats"
                    value={searchRequest.Location}
                    onChange={handleChange}
                />
            </label>
            <label>
                Datum
                <input
                    type="date"
                    name="Date"
                    value={searchRequest.Date}
                    onChange={handleChange}
                />
            </label>
            <label>
                Kategori
                <select
                    name="Category"
                    value={searchRequest.Category}
                    onChange={handleChange}
                >
                    <option value="">Alla kategorier</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.title ?? ""}>
                            {category.title}
                        </option>
                    ))}
                </select>
            </label>
            <button type="button" onClick={handleClear} className="clear-btn">
                Rensa sökfält
            </button>
        </form>
    );
}

export default SearchForm;
