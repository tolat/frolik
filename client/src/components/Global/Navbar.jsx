import { useSelector } from "react-redux";

const Navbar = (props) => {
  const authState = useSelector((state) => state.auth);
  return (
    <div>
      NAVBAR
      {authState.isAuthenticated && <div>{authState.userID}</div>}
    </div>
  );
};

export default Navbar;
