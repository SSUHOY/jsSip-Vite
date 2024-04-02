import { Link } from "react-router-dom";

const Hello = () => {
  return (
    <div>
      <p style={{ color: "black" }}> Hello form extension!</p>
      <Link to="/login">
        <button>Click to start</button>
      </Link>
    </div>
  );
};

export default Hello;
