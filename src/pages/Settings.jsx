import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div className="card" style={{ maxWidth: 500, margin: "60px auto" }}>
      <h2>Settings</h2>

      <label>
        <input type="checkbox" /> Sound
      </label>

      <input type="range" min="0" max="100" />

      <div style={{ marginTop: 20 }}>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
