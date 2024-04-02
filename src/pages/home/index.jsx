import { useState } from "react";
import JsSIP from "jssip";
import * as S from "./home.styled";

const Home = () => {
  const [number, setNumber] = useState("");
  const [incomeCall, setIncomeCall] = useState(false);

  const registeredUserData = JSON.parse(localStorage.getItem("userData"));

  const handleDialPadClick = (value) => {
    setNumber((prevNumber) => prevNumber + value);
  };
  const handleClearInput = () => {
    setNumber("");
  };

  var socket = new JsSIP.WebSocketInterface(
    `wss:/${registeredUserData.server}`
  );
  var configuration = {
    sockets: [socket],
    uri: `sip:${registeredUserData.login}@voip.uiscom.ru`,
    password: `${registeredUserData.password}`,
  };

  var coolPhone = new JsSIP.UA(configuration);

  coolPhone.on("connected", function () {
    console.log("Подключение удалось");
  });

  coolPhone.on("disconnected", function () {
    console.log("disconnected");
  });
  coolPhone.on("newRTCSession", function (e) {
    console.log(e);
    console.log("RTCsession");
    setIncomeCall(true);
  });
  coolPhone.on("newMessage", function () {
    console.log("message");
  });

  coolPhone.start();

 
  // var session = coolPhone.call("sip:bob@example.com", options);

  // const handleOutGoingCall = () => {
  //   session.on("connecting", function () {
  //     console.log("Устанавливается соединение...");
  //   });
  // };

  // let session = coolPhone.call("sip:bob@example.com", {
  //   mediaConstraints: { audio: true, video: false },
  //   pcConfig: {
  //     iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  //   },
  // });

  // session.on("connecting", function () {
  //   console.log("Устанавливается соединение...");
  // });

  // session.on("failed", function (e) {
  //   console.log("Ошибка вызова:", e);
  // });

  // session.on("ended", function () {
  //   console.log("Звонок завершен");
  // });

  // session.on("confirmed", function () {
  //   console.log("Звонок подтвержден");
  // });

  return (
    <div>
      {!incomeCall ? (
        <>
          <div>
            <p>Type sip number</p>
          </div>
          <div>
            <input type="text" value={number} readOnly />
            <button onClick={handleClearInput}>Clear</button>
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
            <button>Call</button>
          </div>
        </>
      ) : (
        <>
          <div>
            <p>Income call</p>
          </div>
          <div>
            <button>Answer</button>
            <button>Decline</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
