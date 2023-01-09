//components

import HomeHeader from "./components/HomeHeader/HomeHeader";
import Menu from "../../components/Menu/Menu";
import HomeBody from "./components/HomeBody/HomeBody";

const Home: React.FC = () => {
  return (
    <div className="home">
      <Menu />
      <HomeHeader />
      <HomeBody />
    </div>
  );
};

export default Home;
