import { useState } from "react";
import JsSIP from "jssip";
import * as S from "./home.styled";

const Home = () => {
  const [number, setNumber] = useState("");
  const [incomeCall, setIncomeCall] = useState(false);
  const [session, setSession] = useState(null);
  console.log("🚀 ~ Home ~ session:", session);
  const [error, setError] = useState("");

  // const registeredUserData = JSON.parse(localStorage.getItem("userData"));
  // var socket = new JsSIP.WebSocketInterface(
  //   `wss:/${registeredUserData.server}`
  // );
  // var configuration = {
  //   sockets: [socket],
  //   uri: `sip:${registeredUserData.login}@voip.uiscom.ru`,
  //   password: `${registeredUserData.password}`,
  // };

  const callOptions = {
    mediaConstraints: { audio: true, video: false },
  };

  var socket = new JsSIP.WebSocketInterface(`wss:/voip.uiscom.ru`);
  var configuration = {
    sockets: [socket],
    uri: `sip:0347052@voip.uiscom.ru`,
    password: `zzc7PvfykF`,
  };

  var coolPhone = new JsSIP.UA(configuration);

  coolPhone.on("connected", function () {
    console.log("Подключение удалось");
  });

  coolPhone.on("disconnected", function () {
    console.log("disconnected");
  });
  coolPhone.on("newRTCSession", function (e) {
    let session = e.session;
    setSession(session);
    setIncomeCall(true);
  });
  coolPhone.on("newMessage", function () {
    console.log("message");
  });
  // запуск телефона
  coolPhone.start();

  const handleDialPadClick = (value) => {
    setNumber((prevNumber) => prevNumber + value);
  };
  const handleClearInput = () => {
    setNumber("");
  };

  // отбой звонка
  const handleDeclineCall = () => {
    if (session) {
      session.terminate();
      setIncomeCall(false);
    }
  };
  // вызов клиента
  const handleInitCall = () => {
    if (number) {
      console.log("object", number);
      const session = coolPhone.call(`sip:${number}`, callOptions);
      setSession(session);
    } else {
      setError("Введите номер клиента");
    }
  };
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
            <div style={{ color: "coral" }}>{error}</div>
            <button onClick={handleInitCall}>Call</button>
          </div>
        </>
      ) : (
        <>
          <div>
            <p>Income call</p>
          </div>
          <div>
            <button>Answer</button>
            <button onClick={handleDeclineCall}>Decline</button>
            <button onClick={() => setIncomeCall(false)}>Ignore</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
