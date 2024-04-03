import { useEffect, useState } from "react";
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
  const [callIsAnswered, setCallIsAnswered] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("");
  const [calls, setCallsList] = useState([]);
  const [phone, setPhone] = useState(null);

  // // ДЛЯ РЕГИСТРАЦИИ
  // const registeredUserData = JSON.parse(localStorage.getItem("userData"));
  // var socket = new JsSIP.WebSocketInterface(
  //   `wss:/${registeredUserData.server}`
  // );
  // var configuration = {
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
      console.log("call failed with cause: " + e.cause);
    },
    ended: function (e) {
      console.log("call ended with cause: " + e.cause);
    },
    confirmed: function (e) {
      console.log("call confirmed" + e);
      var localStream = session.connection.getLocalStreams()[0];
      var dtmfSender = session.connection.createDTMFSender(
        localStream.getAudioTracks()[0]
      );
      session.sendDTMF = function (tone) {
        dtmfSender.insertDTMF(tone);
      };
      setCallIsAnswered(true);
    },
  };

  const callOptions = {
    eventHandlers: eventHandlers,
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
    setPhone(phone);
    phone?.start();
    phoneInitFn(phone, configuration);
  };

  function phoneInitFn(phone, configuration) {
    const remoteAudio = new window.Audio();
    remoteAudio.autoplay = true;
    remoteAudio.crossOrigin = "anonymous";
    if (configuration.uri && configuration.password) {
      phone?.on("registrationFailed", function (ev) {
        alert("Registering on SIP server failed with error: " + ev.cause);
        configuration.uri = null;
        configuration.password = null;
      });
      phone?.on("connected", function () {
        setUserOnline(true);
        console.log("Подключение успешно");
      });
      phone?.on("disconnected", function () {
        setUserOnline(false);
      });
      phone?.on("newRTCSession", function (e) {
        console.log("проверка сессиииии");
        let newSession = e.session;
        setSession(newSession);
        if (session) {
          session.terminate();
        }
        if (newSession._direction === "incoming") {
          console.log("входящий звонок");
          setIncomeCall(true);
          addIncomingCall(session._request.from._uri._user);
          // let audio = new Audio("./tones/zvonok.mp3");
          // audio.play();
          console.log("object");
        }
        if (newSession._direction === "outgoing") {
          console.log("исходящий звонок");
          setOutGoingCall(true);
          addOutGoingCall(session._request.to._uri._user);
        }
        session.on("ended", function () {
          sessionStatus("Call ended");
          setOutGoingCall(false);
          setIncomeCall(false);
          setCallIsAnswered(false);
        });
        session.on("connecting", function () {
          setSessionStatus("Connecting");
        });
        session.on("peerconnection", (e) => {
          console.log("peerconnection", e);
          const peerconnection = e.peerconnection;

          peerconnection.onaddstream = function (e) {
            console.log("addstream", e);
            remoteAudio.srcObject = e.stream;
            remoteAudio.play();
          };

          if (remoteAudio.current) {
            console.log("remote audio already exists");
            const remoteAudio = remoteAudio.current;
            remoteAudio.srcObject = e.stream;
            console.log("включаю play");
            remoteAudio.play();
          }
          const remoteStream = new MediaStream();
          console.log(peerconnection.getReceivers());
          peerconnection.getReceivers().forEach(function (receiver) {
            console.log(receiver);
            remoteStream.addTrack(receiver.track);
          });
        });
      });
    }
  }

  // // запуск телефона
  useEffect(() => {
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

  return (
    <div>
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
          />
        </>
      )}
    </div>
  );
};

export default Home;
