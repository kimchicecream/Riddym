import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (currentUser) {
      navigate(`/session-overview/${currentUser.username}`);
      closeModal();
    }
  }, [currentUser, navigate, closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    }
  };

  const handleDemoLogin = async () => {
    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );
  };

  return (
    <div className="login-modal-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <h4>EMAIL</h4> {errors.email && <p>{errors.email}</p>}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <h4>PASSWORD</h4> {errors.password && <p>{errors.password}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit">Log In</button>
      </form>
      <div className='bottom-divider'>
        <span></span>
        <p>or</p>
        <span></span>
      </div>
      <div className="bottom-button-container">
        <button className='demo-button' onClick={handleDemoLogin}>Log in as demo</button>
      </div>
      <div className='dont-have-account'>
            <p>
                Don&apos;t have an account? <OpenModalButton className='signup-letters' buttonText=' Sign up here' modalComponent={<SignupFormModal />} />.
            </p>
        </div>
    </div>
  );
}

export default LoginFormModal;
