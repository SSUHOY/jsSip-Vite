import { useState } from "react";
import * as S from "./dialing.styled";
import PropTypes from "prop-types";
import { Button, Input } from "antd";
import {
  PhoneOutlined,
  CheckCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import CallsListPopUp from "../calls/list";

const Dialing = ({
  number,
  setNumber,
  callOptions,
  phone,
  setOutGoingCall,
  openList,
  setListIsOpen,
}) => {
  const [error, setError] = useState("");

  const calls = JSON.parse(localStorage.getItem("callHistory")) || [];

  Dialing.propTypes = {
    number: PropTypes.string.isRequired,
    setNumber: PropTypes.func.isRequired,
    callOptions: PropTypes.object.isRequired,
    phone: PropTypes.object.isRequired,
    setSession: PropTypes.func.isRequired,
    setOutGoingCall: PropTypes.func.isRequired,
    calls: PropTypes.array,
    session: PropTypes.object,
    openList: PropTypes.bool,
    setListIsOpen: PropTypes.func,
  };
  // инпут набора номера
  const handleDialPadClick = (value) => {
    setNumber((prevNumber) => prevNumber + value);
    setError("");
  };
  const handleClearInput = () => {
    setNumber("");
  };

  const handleInitCall = () => {
    if (number) {
      phone?.call(`sip:${number}@voip.uiscom.ru`, callOptions);
      setOutGoingCall(true);
    }
    setError("Type number");
  };

  const openCallsList = () => {
    setListIsOpen(!openList);
  };

  return (
    <>
      <div>
        <S.UserOnline>
          <S.OnlineP>
            {" "}
            <CheckCircleOutlined style={{ color: "#00B96B" }} />
            &nbsp; online
          </S.OnlineP>
          <S.CallsList>
            calls list &nbsp;
            <BookOutlined style={{ fontSize: 30 }} onClick={openCallsList} />
          </S.CallsList>
          <CallsListPopUp
            openList={openList}
            setListIsOpen={setListIsOpen}
            calls={calls}
            setNumber={setNumber}
            number={number}
            callOptions={callOptions}
            setOutGoingCall={setOutGoingCall}
            phone={phone}
          />
        </S.UserOnline>
      </div>
      <div>
        <Input
          type="text"
          value={number}
          placeholder="Type sip number"
          style={{ width: 200, margin: 5 }}
        />
        <Button
          onClick={handleClearInput}
          style={{ backgroundColor: "white", color: "black" }}>
          Clear
        </Button>
        <div id="inCallButtons">
          <S.DialPad id="dialPad">
            <S.DialPadChar
              className="dialpad-char"
              data-value="1"
              onClick={() => handleDialPadClick("1")}>
              1
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="2"
              onClick={() => handleDialPadClick("2")}>
              2
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="3"
              onClick={() => handleDialPadClick("3")}>
              3
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="4"
              onClick={() => handleDialPadClick("4")}>
              4
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="5"
              onClick={() => handleDialPadClick("5")}>
              5
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="6"
              onClick={() => handleDialPadClick("6")}>
              6
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="7"
              onClick={() => handleDialPadClick("7")}>
              7
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="8"
              onClick={() => handleDialPadClick("8")}>
              8
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="9"
              onClick={() => handleDialPadClick("9")}>
              9
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="*"
              onClick={() => handleDialPadClick("*")}>
              *
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="0"
              onClick={() => handleDialPadClick("0")}>
              0
            </S.DialPadChar>
            <S.DialPadChar
              className="dialpad-char"
              data-value="#"
              onClick={() => handleDialPadClick("#")}>
              #
            </S.DialPadChar>
          </S.DialPad>
        </div>
        <div style={{ height: 20, margin: 5, color: "coral" }}>{error}</div>
        <Button type="primary" onClick={handleInitCall}>
          <PhoneOutlined />
        </Button>
      </div>
    </>
  );
};

export default Dialing;
