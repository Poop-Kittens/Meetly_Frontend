import Navbar from "../../components/Navbar/Navbar";
import MeetingList from "../../components/MeetingList/MeetingList";

function Home() {
    return (
        <div>
            <h1>Homepage</h1>
            <Navbar activePage="HomePage" />
            <MeetingList />
        </div>
    );
}

export default Home;
