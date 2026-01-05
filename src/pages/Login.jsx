import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) nav("/home");
    else alert(error.message);
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "80px auto" }}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button style={{ width: "100%", marginTop: 16 }} onClick={login}>
        Login
      </button>
      <p style={{ marginTop: 12 }}>
        New here? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
