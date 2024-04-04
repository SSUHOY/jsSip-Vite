import { useEffect, useRef, useState } from "react";
import JsSIP from "jssip";
import IncomingCall from "../../components/calls/incoming";
import Dialing from "../../components/dialing";
import OutGoingCall from "../../components/calls/outgoing";
import CurrentCallUi from "../../components/current";

const Home = () => {
  const [number, setNumber] = useState("");
  const [incomeCall, setIncomeCall] = useState(false);
  const [outGoingCall, setOutGoingCall] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
  const [error, setError] = useState("");
  const [callIsAnswered, setCallIsAnswered] = useState(false);
  const [session, setSession] = useState(null);
  // console.log("🚀 ~ Home ~ session:", session);
  const [sessionStatus, setSessionStatus] = useState("");
  const [calls, setCallsList] = useState([]);
  const [phone, setPhone] = useState(null);
  const [mute, setMicIsMuted] = useState(false);

  const remoteAudioRef = useRef(null);

  const incomingCallAudio = new window.Audio("./tones/zvonok.mp3");
  incomingCallAudio.loop = true;
  incomingCallAudio.crossOrigin = "anonymous";
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
    progress: function (e) {
      console.log("call is in progress", e);
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
      console.log("call ended with cause: " + e.cause);
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
      offerToReceiveAudio: 1, // Принимаем только аудио
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
    console.log("PHONE STARTED");
    setPhone(phone);
    phone?.start();
    phoneInitFn(phone, configuration);
  };

  function phoneInitFn(phone, configuration) {
    const remoteAudio = new window.Audio();
    remoteAudio.autoplay = true;
    remoteAudio.crossOrigin = "anonymous";
    if (configuration.uri && configuration.password) {
      // JsSIP.debug.enable("JsSIP:*"); // more detailed debug output
      phone.on("registrationFailed", function () {
        // alert("Registering on SIP server failed with error: " + ev.cause);
        // configuration.uri = null;
        // configuration.password = null;
        // setUserOnline(false);
        setUserOnline(false);
        updateUI();
      });
      phone.on("newRTCSession", function (ev) {
        console.log("УСТАНОВКА СЕССИИ В СТЕЙТ");
        const session = ev.session;
        setSession(session);
        setSessionStatus("");
        // if (session) {
        //   // hangup any existing call
        //   session.terminate();
        // }

        const completeSession = function () {
          setSession(null);
          setIncomeCall(false);
          updateUI();
        };

        session.on("progress", (data) => {
          setSessionStatus("In progress");
          if (data.originator === "remote") {
            console.log("ОТПИСКА ОТ СОБЫТИЯ");
            data.response.body = null;
          }
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
        session.on("failed", completeSession, console.log("SESSION FAILED"));
        session.on("peerconnection", (e) => {
          console.log("peerconnection", e);
          setError("");
          const peerconnection = e.peerconnection;

          peerconnection.onaddstream = function (e) {
            console.log("addstream", e);
            // set remote audio stream (to listen to remote audio)
            // remoteAudio is <audio> element on pag
            remoteAudio.srcObject = e.stream;
            remoteAudio.play();
          };

          const remoteStream = new MediaStream();
          console.log(peerconnection.getReceivers());
          peerconnection.getReceivers().forEach(function (receiver) {
            console.log(receiver);
            remoteStream.addTrack(receiver.track);
          });
        });

        if (session._direction === "incoming") {
          // incomingCallAudio.play();
          console.log("входящий звонок");
          setIncomeCall(true);
          addIncomingCall(session._request.from._uri._user);
          if (session.direction === "incoming") {
            let audio = new Audio("./call/call.mp3");
            audio.play();

            session.on("accepted", () => {
              setSessionStatus("In Call");
              updateUI();
            });
          }
        } else {
          console.log("con", session.connection);
          addOutGoingCall(session._request.to._uri._user);
          session.connection.addEventListener("addstream", function (e) {
            // incomingCallAudio.pause();
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
          console.log("входящий звонок");
          setIncomeCall(true);
          addIncomingCall(session._request.from._uri._user);
          // let audio = new Audio("./tones/zvonok.mp3");
          // audio.play();
          console.log("object");
        } else {
          console.log("исходящий звонок");
          setOutGoingCall(true);
          setSessionStatus("in progress");
          addOutGoingCall(session._request.to._uri._user);
        }
      } else if (session.isEstablished()) {
        setSessionStatus("in Call");
        incomingCallAudio.pause();
      }
    } else {
      incomingCallAudio.pause();
    }
  }
  // // запуск телефона
  useEffect(() => {
    const calls = JSON.parse(localStorage.getItem("callHistory"));
    setCallsList(calls);
    startPhone();
  }, []);

  const addIncomingCall = (number) => {
    const newCall = { type: "incoming", number };
    setCallsList([...calls, newCall]);
    localStorage.setItem("callHistory", JSON.stringify(calls));
  };
  const addOutGoingCall = (number) => {
    const newCall = { type: "outgoing", number };
    setCallsList([...calls, newCall]);
    localStorage.setItem("callHistory", JSON.stringify(calls));
  };

  const muteMic = () => {
    console.log("MUTE CLICKED");

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
      {error ? error : ""}
      {!incomeCall && !outGoingCall && !callIsAnswered && (
        <Dialing
          userOnline={userOnline}
          number={number}
          session={session}
          setNumber={setNumber}
          phone={phone}
          setOutGoingCall={setOutGoingCall}
          setSession={setSession}
          callOptions={callOptions}
          calls={calls}
        />
      )}
      {incomeCall && !outGoingCall && !callIsAnswered && (
        <>
          <IncomingCall
            session={session}
            callOptions={callOptions}
            setIncomeCall={setIncomeCall}
            setCallIsAnswered={setCallIsAnswered}
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
          />
        </>
      )}
      <audio ref={remoteAudioRef}></audio>
    </div>
  );
};

export default Home;
