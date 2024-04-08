import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as S from "./login.styled";
import { Button, Input } from "antd";

const Login = ({ userData, setUserData }) => {
  Login.propTypes = {
    userData: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired,
  };

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSetUserData = () => {
    if (
      userData.password !== "" &&
      userData.login !== "" &&
      userData.server !== "" &&
      userData.password === "zzc7PvfykF" &&
      userData.login === "0347052" &&
      userData.server === "voip.uiscom.ru"
    ) {
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/home");
    } else if (
      userData.password === "" &&
      userData.login === "" &&
      userData.server === ""
    ) {
      setError("Enter all the required fields");
    } else if (
      userData.password !== "zzc7PvfykF" &&
      userData.login !== "0347052" &&
      userData.server !== "voip.uiscom.ru"
    ) {
      setError("User doesn't exist");
    }
  };

  useEffect(() => {
    setError("");
  }, [userData]);

  return (
    <S.Wrapper>
      {" "}
      <div style={{ height: 20 }}>
        {error ? <S.Error>{error}</S.Error> : ""}
      </div>
      <S.InputsField>
        <Input
          type="text"
          placeholder="Login"
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              login: e.target.value.trim(),
            }))
          }
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              password: e.target.value,
            }))
          }
        />
        <Input
          type="text"
          placeholder="Server"
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              server: e.target.value.trim(),
            }))
          }
        />
      </S.InputsField>
      <S.Buttons>
        <Button type="primary" onClick={handleSetUserData}>
          Login
        </Button>
        <Link to={"/"}>
          <Button>Back to start</Button>
        </Link>
      </S.Buttons>
    </S.Wrapper>
  );
};

export default Login;
