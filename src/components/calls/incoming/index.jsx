import { Button } from "antd";
import PropTypes from "prop-types";
import * as S from "./incoming.styled";

const IncomingCall = ({
  session,
  callOptions,
  setIncomeCall,
  setCallIsAnswered,
}) => {
  IncomingCall.propTypes = {
    session: PropTypes.object.isRequired,
    callOptions: PropTypes.object.isRequired,
    setIncomeCall: PropTypes.func.isRequired,
    setCallIsAnswered: PropTypes.func.isRequired,
  };

  // отбой звонка
  const handleDeclineCall = () => {
    if (session) {
      session.terminate();
      setIncomeCall(false);
    }
  };

  const handleAnswerCall = () => {
    session.answer(callOptions);
    setCallIsAnswered(true);
  };

  return (
    <>
      <S.IncomingCallInformation>
        <p>Incoming call from:</p>
        <h3>+{session ? session._request.from._uri._user : "Unknown"}</h3>
      </S.IncomingCallInformation>
      <S.ButtonsContainer>
        <Button type="primary" onClick={handleAnswerCall}>
          Answer
        </Button>
        <Button onClick={handleDeclineCall}>Decline</Button>
      </S.ButtonsContainer>
    </>
  );
};

export default IncomingCall;