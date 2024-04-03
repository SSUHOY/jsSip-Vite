import { Button } from "antd";
import { Link } from "react-router-dom";
import * as S from "./hello.styled";

const Hello = () => {
  return (
    <S.HelloWrapper>
      <p style={{ color: "black" }}>Hello!</p>
      <Link to="/login">
        <Button type="primary">Click to start calling</Button>
      </Link>
    </S.HelloWrapper>
  );
};

export default Hello;
