//components

import HomeHeader from "./components/HomeHeader/HomeHeader";
import Menu from "../../components/Menu/Menu";
import HomeBody from "./components/HomeBody/HomeBody";
import NavBar from "../../components/NavBar/NavBar";

const Home: React.FC = () => {
  return (
    <div className="home">
      <NavBar />
      <Menu />
      <HomeHeader />
      <HomeBody />
    </div>
  );
};

export default Home;
