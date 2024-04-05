import { Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as S from "./current.styled";
import {
  AudioMutedOutlined,
  AudioOutlined,
  PhoneOutlined,
  DisconnectOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const CurrentCallUi = ({ session, sessionStatus, onClickMute, mute }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  CurrentCallUi.propTypes = {
    number: PropTypes.string,
    session: PropTypes.object.isRequired,
    setOutGoingCall: PropTypes.func.isRequired,
    setCallIsAnswered: PropTypes.func.isRequired,
    setIncomeCall: PropTypes.func,
    onClickMute: PropTypes.func,
    mute: PropTypes.bool,
    sessionStatus: PropTypes.string,
  };

  const handleDeclineCall = () => {
    stopTimer();
    session.terminate();
  };

  useEffect(() => {
    if (sessionStatus === "In Call") {
      startTimer();
    }
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, session, sessionStatus]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  return (
    <>
      <div>
        <S.CurrentCallInformation>
          {sessionStatus === "In Call" && <PhoneOutlined />}
          {sessionStatus === "Ended" && <DisconnectOutlined />}
          {sessionStatus === "In progress" && <LoadingOutlined />}
          {sessionStatus === "Unavailable" && <CloseCircleOutlined />}
          <h4>{sessionStatus}...</h4>
          <p>#{session._request.from._uri._user}</p>
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
