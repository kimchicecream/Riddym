import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import { useSelector, useDispatch } from "react-redux";
import { thunkLogin } from "../../redux/session";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const handleDemoLogin = async () => {
    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );

    navigate(`/session-overview/${sessionUser.username}`);
  };

  return (
    <div className="navigation-container">
      <div className="logo-container">
          <img src="../../../riddym-logo.png" />
      </div>
      <div className="nav-menu">
        {sessionUser && (
          <>
            <button className="overview-button">Session Overview</button>
            <button className="creator-button">Track Creator</button>
          </>
        )}
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
