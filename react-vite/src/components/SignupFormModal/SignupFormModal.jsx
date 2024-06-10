import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const { closeModal } = useModal();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const formData = new FormData();

    formData.append('email', email);
    formData.append('username', username);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('password', password);

    if (imageFile) formData.append('image_file', imageFile);

    const serverResponse = await dispatch(thunkSignup(formData));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-modal-container">
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <h4>USERNAME</h4> {errors.username && <p>{errors.username}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <h4>FIRST NAME</h4> {errors.first_name && <p>{errors.first_name}</p>}
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          <h4>LAST NAME</h4> {errors.last_name && <p>{errors.last_name}</p>}
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        <label>
          <h4>CONFIRM PASSWORD</h4> {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {/* <label>
          <h4>PROFILE IMAGE</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label> */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
