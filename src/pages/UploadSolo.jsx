import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";
import { extractTextFromPDF } from "../ai/pdfReader";
import { summarizeText } from "../ai/summarizer";
import { generateSummaryPDF } from "../utils/pdf";

export default function UploadSolo() {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("upload");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }

      const user = userData.user;
      const path = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } =
        await supabase.storage.from("notes").upload(path, file);

      if (uploadError) {
        throw uploadError;
      }

      // SUCCESS
      setStage("summarize");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      // THIS IS THE KEY FIX
      setLoading(false);
    }
  };

  const summarize = async () => {
    setLoading(true);

    try {
      let text = "";

      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      const result = await summarizeText(text);
      setSummary(result);
      setStage("done");
    } catch (err) {
      console.error("Summarization failed:", err);
      alert("Summarization failed. Is Ollama running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "60px 20px" }}>
      <motion.div
        className="game-panel"
        style={{ maxWidth: 620, margin: "0 auto" }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>Solo Run</h2>

        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
              />

              <button
                style={{ marginTop: 16 }}
                onClick={upload}
                disabled={loading}
              >
                {loading ? "Uploading…" : "Upload Notes"}
              </button>
            </motion.div>
          )}

          {stage === "summarize" && (
            <motion.div key="summarize" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p>Upload complete ✅</p>

              <button onClick={summarize} disabled={loading}>
  {loading ? "Summarizing (this may take ~30s)..." : "Generate Summary"}
              </button>

            </motion.div>
          )}

          {stage === "done" && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p>{summary}</p>

              <button
                className="secondary"
                onClick={() => generateSummaryPDF(summary)}
              >
                Download PDF
              </button>

              <button style={{ marginLeft: 10 }}>
                Continue to Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
