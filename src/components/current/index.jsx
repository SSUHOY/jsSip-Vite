import { Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as S from "./current.styled";

const CurrentCallUi = ({
  session,
  setOutGoingCall,
  setCallIsAnswered,
  setIncomeCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  session.on("confirmed", function () {
    startTimer();
  });

  CurrentCallUi.propTypes = {
    number: PropTypes.object.string,
    session: PropTypes.object.isRequired,
    setOutGoingCall: PropTypes.func.isRequired,
    setCallIsAnswered: PropTypes.func.isRequired,
    setIncomeCall: PropTypes.func.isRequired,
  };

  const handleDeclineCall = () => {
    if (session) {
      setOutGoingCall(false);
      setIncomeCall(false);
      setCallIsAnswered(false);
      stopTimer();
      resetTimer();
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
    console.log("dsdsdsd");
    setIsActive(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <>
      <div>
        <div>
          <p>+{session._request.from._uri._user}</p>
        </div>
        <div>
          <S.CallTimer>
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}
            :{(seconds % 60).toString().padStart(2, "0")}
          </S.CallTimer>
        </div>
      </div>
      <div>
        <Button onClick={handleDeclineCall}>Decline</Button>
      </div>
    </>
  );
};

export default CurrentCallUi;
