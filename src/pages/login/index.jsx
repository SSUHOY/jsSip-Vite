import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as S from "./login.styled";

const Login = ({ userData, setUserData }) => {
  Login.propTypes = {
    userData: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired,
  };

  const [registered, setIsRegistered] = useState(false);
  console.log("🚀 ~ Login ~ registered:", registered);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSetUserData = () => {
    if (
      userData.password !== "" &&
      userData.login !== "" &&
      userData.server !== ""
    ) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsRegistered(true);
      navigate("/home");
    } else {
      setError("Please enter all the required fields");
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [userData]);

  return (
    <div>
      <S.InputsField>
        <input
          type="text"
          placeholder="Login"
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              login: e.target.value,
            }))
          }
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              password: e.target.value,
            }))
          }
        />
        <input
          type="text"
          placeholder="Server"
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              server: e.target.value,
            }))
          }
        />
      </S.InputsField>
      <S.Buttons>
        {error ? <p style={{ color: "coral" }}>{error}</p> : ""}
        <S.Button onClick={handleSetUserData}>Register</S.Button>
        <Link to={"/"}>
          <S.Button>Back to start</S.Button>
        </Link>
      </S.Buttons>
    </div>
  );
};

export default Login;
