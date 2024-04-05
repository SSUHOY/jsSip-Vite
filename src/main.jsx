import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MemoryRouter>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#00B96B",
            colorPrimaryHover: "#07df85",
            colorPrimaryActive: "#05b36a",
            defaultColor: "white",
            defaultBg: "#DB115A",
            defaultHoverBg: "#EE467F",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "transparent",
          },
          Input: {
            colorPrimaryBg: "#E6F4FF",
            colorPrimary: "#1777FE",
          },
        },
      }}>
      <App />
    </ConfigProvider>
  </MemoryRouter>
);
