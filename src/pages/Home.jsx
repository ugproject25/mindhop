import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{ padding: "60px 20px" }}>
      <motion.div
        className="game-panel"
        style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1>mindhop</h1>
        <p>Turn notes into a playable learning experience</p>

        <div style={{ marginTop: 40, display: "grid", gap: 18 }}>
          <button onClick={() => nav("/upload")}>
            Upload & Learn
          </button>

          <button className="secondary" onClick={() => nav("/performance")}>
            Performance
          </button>

          <button className="secondary" onClick={() => nav("/settings")}>
            Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
