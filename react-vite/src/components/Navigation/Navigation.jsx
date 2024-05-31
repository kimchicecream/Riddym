import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import { useSelector, useDispatch } from "react-redux";
import { thunkLogin } from "../../redux/session";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const handleDemoLogin = async () => {
    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );
  };

  return (
    <div className="navigation-container">
      <div className="logo-container">
          <img src="../../../public/riddym-logo.png" />
      </div>
      <div className="nav-menu">
        <button className="play-button">Play</button>
        <button className="explore-button">Explore Tracks</button>
      </div>
      {sessionUser ? (
          <div className="logged-in">
              <ProfileButton user={sessionUser} />
          </div>
      ) : (
          <div className="signup-login-container">
              <button onClick={handleDemoLogin}>
                  Demo
              </button>
              <OpenModalButton
                  buttonText="Log In"
                  modalComponent={<LoginFormModal />}
                  className="login-button"
              />
              <OpenModalButton
                  buttonText="Sign Up"
                  modalComponent={<SignupFormModal />}
                  className="signup-button"
              />
          </div>
      )}
    </div>
  );
}

export default Navigation;
