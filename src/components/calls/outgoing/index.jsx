import PropTypes from "prop-types";
import * as S from "./outgoingCall.styled";
import { Button } from "antd";
import { LoadingOutlined, RollbackOutlined } from "@ant-design/icons";

const OutGoingCall = ({ number, session, setOutGoingCall, sessionStatus }) => {
  OutGoingCall.propTypes = {
    number: PropTypes.object.string,
    session: PropTypes.object.isRequired,
    setOutGoingCall: PropTypes.func.isRequired,
    sessionStatus: PropTypes.bool.isRequired,
  };

  const handleDeclineCall = () => {
    if (session) {
      setOutGoingCall(false);
      session.terminate();
    }
  };

  return (
    <>
      <S.OutGoingCallHeader>
        <h4>
          {sessionStatus === "Busy" ? (
            <RollbackOutlined />
          ) : (
            <LoadingOutlined />
          )}
          <pre />
          {sessionStatus}...
        </h4>
        <p>Outgoing call to: {number}</p>
      </S.OutGoingCallHeader>
      <div>
        <Button onClick={handleDeclineCall}>Decline</Button>
      </div>
    </>
  );
};

export default OutGoingCall;
