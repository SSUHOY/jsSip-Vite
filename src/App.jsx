import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hello from "./pages/hello";
import Home from "./pages/home";
import { useState } from "react";
import Login from "./pages/login";

function App() {
  const [userData, setUserData] = useState({
    login: "",
    password: "",
    server: "",
  });
  const [userOnline, setUserOnline] = useState(false);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login userData={userData} setUserData={setUserData} />}
      />
      <Route path="/" element={<Hello />} />
      <Route
        path="/home"
        element={<Home userOnline={userOnline} setUserOnline={setUserOnline} />}
      />
    </Routes>
  );
}

export default App;
