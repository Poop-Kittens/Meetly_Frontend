import Navbar from "../../components/Navbar/Navbar";
function Home() {
    return (
        <div>
            <Navbar ActivePage="HomePage" ActiveUser="John Doe" />
            <h1>Homepage</h1>
        </div>
    );
}

export default Home;
