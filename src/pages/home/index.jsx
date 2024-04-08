import { useEffect, useRef, useState } from "react";
import JsSIP from "jssip";
import PropTypes from "prop-types";
import IncomingCall from "../../components/calls/incoming";
import Dialing from "../../components/dialing";
import OutGoingCall from "../../components/calls/outgoing";
import CurrentCallUi from "../../components/current";
import { formatCallDate } from "./helpers";

const Home = ({ userOnline, setUserOnline }) => {
  const [number, setNumber] = useState("");
  const [incomeCall, setIncomeCall] = useState(false);
  const [outGoingCall, setOutGoingCall] = useState(false);
  const [callIsAnswered, setCallIsAnswered] = useState(false);
  const [session, setSession] = useState(null);
  const [calls, setCalls] = useState([]);
  const [sessionStatus, setSessionStatus] = useState("");
  const [phone, setPhone] = useState(null);
  const [mute, setMicIsMuted] = useState(false);
  const [openList, setListIsOpen] = useState(false);

  const remoteAudioRef = useRef(null);

  Home.propTypes = {
    userOnline: PropTypes.bool,
    setUserData: PropTypes.func,
    setUserOnline: PropTypes.func,
  };

  // // ДЛЯ РЕГИСТРАЦИИ
  // const registeredUserData = JSON.parse(localStorage.getItem("userData"));
  // const socket = new JsSIP.WebSocketInterface(
  //   `wss:/${registeredUserData.server}`
  // );
  // const configuration = {
  //   sockets: [socket],
  //   uri: `sip:${registeredUserData.login}@voip.uiscom.ru`,
  //   password: `${registeredUserData.password}`,
  // };

  // Обработка событии исх. звонка
  const eventHandlers = {
    progress: function () {
      setSessionStatus("Ringing");
    },
    failed: function (e) {
      setSessionStatus(e.cause);
      setTimeout(() => {
        setOutGoingCall(false);
        setCallIsAnswered(false);
        updateUI();
      }, 2000);
    },
    ended: function (e) {
      setSessionStatus("Call ended with cause:" + e.cause);
    },
    confirmed: function () {
      setSessionStatus("In Call");
      setCallIsAnswered(true);
    },
  };

  const callOptions = {
    eventHandlers: eventHandlers,
    sessionTimersExpires: 200,
    extraHeaders: ["X-Foo: foo", "X-Bar: bar"],
    mediaConstraints: { audio: true, video: false },
    pcConfig: {
      hackStripTcp: true,
      rtcpMuxPolicy: "negotiate",
      iceServers: [],
    },
    rtcOfferConstraints: {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 0,
    },
  };

  const startPhone = () => {
    const socket = new JsSIP.WebSocketInterface(`wss:/voip.uiscom.ru`);
    const configuration = {
      sockets: [socket],
      uri: `sip:0347052@voip.uiscom.ru`,
      password: `zzc7PvfykF`,
    };
    const phone = new JsSIP.UA(configuration);
    setPhone(phone);
    phone?.start();
    phoneInitFn(phone, configuration);
  };

  function phoneInitFn(phone, configuration) {
    const remoteAudio = new window.Audio();
    remoteAudio.autoplay = true;
    remoteAudio.crossOrigin = "anonymous";
    if (configuration.uri && configuration.password) {
      phone.on("registered", () => {
        setUserOnline(true);
      });
      phone.on("registrationFailed", function () {
        setUserOnline(false);
        updateUI();
      });
      phone.on("newRTCSession", function (ev) {
        const session = ev.session;
        setSession(session);
        setSessionStatus("Connecting");

        const completeSession = function () {
          setSession(null);
          setIncomeCall(false);
          updateUI();
        };

        session.on("progress", (data) => {
          setSessionStatus("In progress");
          if (data.originator === "remote") {
            data.response.body = null;
          }
        });

        session.on("confirmed", function () {
          const localStream = session.connection.getLocalStreams()[0];
          const dtmfSender = session.connection.createDTMFSender(
            localStream.getAudioTracks()[0]
          );
          session.sendDTMF = function (tone) {
            dtmfSender.insertDTMF(tone);
          };
          updateUI();
        });

        session.on("peerconnection", (e) => {
          const peerconnection = e.peerconnection;
          peerconnection.onaddstream = function (e) {
            remoteAudio.srcObject = e.stream;
            remoteAudio.play();
          };
          const remoteStream = new MediaStream();
          peerconnection.getReceivers().forEach(function (receiver) {
            remoteStream.addTrack(receiver.track);
          });
        });
        session.on("failed", () => {
          completeSession;
        });
        session.on("ended", function () {
          setSessionStatus("Ended");
          setTimeout(() => {
            setOutGoingCall(false);
            setIncomeCall(false);
            setCallIsAnswered(false);
            updateUI();
          }, 2000);
        });
        if (session._direction === "incoming") {
          remoteAudioRef.current.play();
          remoteAudioRef.current.volume = 0.5;
          setIncomeCall(true);
          addIncomingCall(session._request.from._uri._user);

          session.on("accepted", () => {
            setSessionStatus("In Call");
            remoteAudioRef.current.pause();
            updateUI();
          });
        } else {
          addOutGoingCall(session._request.to._uri._user);
          session.connection.addEventListener("addstream", function (e) {
            remoteAudioRef.current.pause();
            remoteAudio.srcObject = e.stream;
          });
        }
        updateUI();
      });
    }
  }

  function updateUI() {
    if (session) {
      if (session.isInProgress()) {
        if (session._direction === "incoming") {
          setIncomeCall(true);
        } else {
          setOutGoingCall(true);
          setSessionStatus("In progress");
        }
      } else if (session.isEstablished()) {
        setSessionStatus("In Call");
      }
    }
  }

  useEffect(() => {
    startPhone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOnline]);

  const addCall = (call) => {
    setCalls((prevCalls) => [...prevCalls, call]);
  };

  const addIncomingCall = (number) => {
    const newCallIncoming = {
      type: "incoming",
      number,
      time: formatCallDate(new Date()),
    };
    addCall(newCallIncoming);
  };

  const addOutGoingCall = (number) => {
    const newCallOutgoing = {
      type: "outgoing",
      number,
      time: formatCallDate(new Date()),
    };
    addCall(newCallOutgoing);
  };

  useEffect(() => {
    localStorage.setItem("callHistory", JSON.stringify(calls));
  }, [calls]);

  const muteMic = () => {
    if (session.isMuted().audio) {
      session.unmute({ audio: true });
      setMicIsMuted(false);
    } else {
      session.mute({ audio: true });
      setMicIsMuted(true);
    }
    updateUI();
  };

  return (
    <div>
      {!incomeCall && !outGoingCall && !callIsAnswered && (
        <Dialing
          userOnline={userOnline}
          number={number}
          setNumber={setNumber}
          phone={phone}
          setOutGoingCall={setOutGoingCall}
          setSession={setSession}
          callOptions={callOptions}
          openList={openList}
          setListIsOpen={setListIsOpen}
        />
      )}
      {incomeCall && !outGoingCall && !callIsAnswered && (
        <>
          <IncomingCall
            session={session}
            callOptions={callOptions}
            setIncomeCall={setIncomeCall}
            setCallIsAnswered={setCallIsAnswered}
            remoteAudioRef={remoteAudioRef}
          />
        </>
      )}
      {outGoingCall && !incomeCall && !callIsAnswered && (
        <>
          <OutGoingCall
            session={session}
            setOutGoingCall={setOutGoingCall}
            number={number}
            setCallIsAnswered={setCallIsAnswered}
            sessionStatus={sessionStatus}
            remoteAudioRef={remoteAudioRef}
          />
        </>
      )}
      {callIsAnswered && !incomeCall && outGoingCall && (
        <>
          {/* Исходящий звонок */}
          <CurrentCallUi
            session={session}
            setIncomingCall={setIncomeCall}
            setOutGoingCall={setOutGoingCall}
            setCallIsAnswered={setCallIsAnswered}
            onClickMute={muteMic}
            mute={mute}
            sessionStatus={sessionStatus}
            callOptions={callOptions}
            outGoingCall={outGoingCall}
            number={number}
          />
        </>
      )}
      {callIsAnswered && incomeCall && (
        <>
          {/* Входящий звонок */}
          <CurrentCallUi
            session={session}
            setIncomeCall={setIncomeCall}
            setOutGoingCall={setOutGoingCall}
            setCallIsAnswered={setCallIsAnswered}
            onClickMute={muteMic}
            mute={mute}
            sessionStatus={sessionStatus}
            callOptions={callOptions}
            outGoingCall={outGoingCall}
            number={number}
          />
        </>
      )}
      <audio loop ref={remoteAudioRef} src="/tones/zvonok.mp3" />
    </div>
  );
};

export default Home;
