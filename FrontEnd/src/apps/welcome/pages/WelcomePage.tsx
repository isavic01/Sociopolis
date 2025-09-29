import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Sociopolis!</h1>

      <div style={styles.buttonBox}>
        <button style={styles.button} onClick={() => navigate("/auth")}>
          Log In
        </button>
        <button style={styles.button} onClick={() => navigate("/register")}>
          Sign Up
        </button>
        <button
          style={{ ...styles.button, background: "#4CAF50" }}
          onClick={() => navigate("/lesson/1")}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}


// quick inline style for now
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
   
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "2rem"
  },
  buttonBox: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    width: "200px"
  },
  button: {
    display: "block",
    textAlign: "center" as const,
    padding: "0.75rem",
    fontSize: "1.2rem",
    borderRadius: "8px",
    background: "#f2d88f",
    color: "black",
    textDecoration: "none"
  }
};
