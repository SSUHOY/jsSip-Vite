import { Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as S from "./current.styled";
import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";

const CurrentCallUi = ({ session, sessionStatus, onClickMute, mute }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  session.on("confirmed", function () {
    console.log("object confirmed");
    startTimer();
  });

  CurrentCallUi.propTypes = {
    number: PropTypes.object.string,
    session: PropTypes.object.isRequired,
    setOutGoingCall: PropTypes.func.isRequired,
    setCallIsAnswered: PropTypes.func.isRequired,
    setIncomeCall: PropTypes.func.isRequired,
    onClickMute: PropTypes.func,
    mute: PropTypes.bool,
    sessionStatus: PropTypes.string,
  };

  const handleDeclineCall = () => {
    if (session) {
      stopTimer();
      session.terminate();
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, session]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  // const resetTimer = () => {
  //   setSeconds(0);
  //   setIsActive(false);
  // };

  return (
    <>
      <div>
        <S.CurrentCallInformation>
          <h4>{sessionStatus}...</h4>
          <p>+{session._request.from._uri._user}</p>
        </S.CurrentCallInformation>
        <div>
          <S.CallTimer>
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}
            :{(seconds % 60).toString().padStart(2, "0")}
          </S.CallTimer>
        </div>
      </div>
      <S.CallHandlers>
        <Button
          onClick={onClickMute}
          style={{
            background: "#FFFFFF",

            color: "black",
            width: 78,
          }}>
          {mute ? <AudioMutedOutlined /> : <AudioOutlined />}
        </Button>
        <Button onClick={handleDeclineCall}>Decline</Button>
      </S.CallHandlers>
    </>
  );
};

export default CurrentCallUi;
