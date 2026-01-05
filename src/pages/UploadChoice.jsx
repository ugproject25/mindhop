import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function UploadChoice() {
  const nav = useNavigate();

  return (
    <div style={{ padding: "60px 20px" }}>
      <motion.div
        className="game-panel"
        style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2>Select Mode</h2>
        <p>How do you want to learn?</p>

        <div
          style={{
            marginTop: 30,
            display: "grid",
            gap: 20
          }}
        >
          <button onClick={() => nav("/solo")}>
            Solo Run
          </button>

          <button className="secondary" onClick={() => nav("/collab")}>
            Collab Room
          </button>
        </div>
      </motion.div>
    </div>
  );
}
