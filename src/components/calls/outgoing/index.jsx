import PropTypes from "prop-types";
import * as S from "./outgoingCall.styled";
import { Button } from "antd";
import {
  LoadingOutlined,
  RollbackOutlined,
  CloseCircleOutlined,
  ApiOutlined,
} from "@ant-design/icons";

const OutGoingCall = ({
  number,
  session,
  setOutGoingCall,
  sessionStatus,
  remoteAudioRef,
}) => {
  OutGoingCall.propTypes = {
    number: PropTypes.string,
    session: PropTypes.object,
    setOutGoingCall: PropTypes.func.isRequired,
    sessionStatus: PropTypes.bool.isRequired,
    remoteAudioRef: PropTypes.string,
  };

  const handleDeclineCall = () => {
    remoteAudioRef.current.pause();
    setOutGoingCall(false);
    session.terminate();
  };

  return (
    <>
      <S.OutGoingCallHeader>
        <h4>
          {sessionStatus === "Busy" && <RollbackOutlined />}
          {sessionStatus === "In progress" && <LoadingOutlined />}
          {sessionStatus === "Unavailable" && <CloseCircleOutlined />}
          {sessionStatus === "Connecting" && <ApiOutlined />}
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
