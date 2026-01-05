import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) nav("/");
    else alert(error.message);
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "80px auto" }}>
      <h2>Register</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button style={{ width: "100%", marginTop: 16 }} onClick={register}>
        Create Account
      </button>
    </div>
  );
}
