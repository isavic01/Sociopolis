import { useEffect, useState } from "react";
import "./App.css";
import "./styles/main.scss";

const bodyCopy = `Design tokens drive consistent typography, motion, and color across Sociopolis interfaces. Adjust copy, spacing, and layout without redefining the core scale.`;
const leadCopy = `These samples pull directly from the new typography and color maps so you can confirm the mixins compile to usable CSS variables.`;

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.classList.toggle("theme-light", theme === "light");
  }, [theme]);

  return (
    <div className="app">
      <section className="test-card">
        <p className="subheading">Typography Tokens</p>
        <h1 className="h1">Sociopolis Display Scale</h1>
        <h2 className="h2">Design System Playground</h2>
        <p className="lead">{leadCopy}</p>
        <p className="text">{bodyCopy}</p>

        <div className="button-row">
          <button type="button" className="btn-form">
            Submit Form
          </button>
          <button type="button" className="btn-cta">
            Call To Action
          </button>
          <button type="button" className="btn-sm">
            Secondary
          </button>
        </div>

        <div className="test-labels">
          <span className="label-strong">Label Strong</span>
          <span className="label">Label Base</span>
        </div>

        <div className="theme-toggle">
          <span className="label">Theme</span>
          <button
            type="button"
            onClick={() => setTheme("light")}
            disabled={theme === "light"}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            disabled={theme === "dark"}
          >
            Dark
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
