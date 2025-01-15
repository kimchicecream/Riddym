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

  // const handleDemoLogin = async () => {
  //   await dispatch(
  //     thunkLogin({
  //       email: "demo@aa.io",
  //       password: "password",
  //     })
  //   );

  //   navigate(`/session-overview/${sessionUser.username}`);
  // };

  // commit 6

  const handleSessionOverview = () => {
    navigate(`/session-overview/${sessionUser.username}`);
  };

  const handleCreateTrack = () => {
    navigate(`/add-song`);
  };

  const handleBrowse = () => {
    navigate('/browse');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="navigation-container">
      <div className="logo-container">
          <img src="../../../riddym-logo.png" onClick={handleLogoClick}/>
      </div>
      <div className="nav-menu">
        {sessionUser && (
          <>
            <button className="browse-button" onClick={handleBrowse}>Browse Tracks</button>
            <button className="overview-button" onClick={handleSessionOverview}>Session Overview</button>
            <button className="creator-button" onClick={handleCreateTrack}>Create a Track</button>
          </>
        )}
      </div>
      {sessionUser ? (
          <div className="logged-in">
              <ProfileButton user={sessionUser} />
          </div>
      ) : (
          <div className="signup-login-container">
              <OpenModalButton
                  buttonText="Log In"
                  modalComponent={<LoginFormModal />}
                  className="login-button"
              />
              <OpenModalButton
                  buttonText="Play Now"
                  modalComponent={<SignupFormModal />}
                  className="signup-button"
              />
          </div>
      )}
    </div>
  );
}

export default Navigation;
