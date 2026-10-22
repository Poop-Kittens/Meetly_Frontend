import Navbar from "../../components/Navbar/Navbar";
function Home() {
  return (
    <div>
      <Navbar activePage="HomePage" activeUser="John Doe" />
      <h1>Homepage</h1>
    </div>
  );
}

export default Home;
