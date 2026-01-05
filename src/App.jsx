import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./supabase";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UploadChoice from "./pages/UploadChoice";
import UploadSolo from "./pages/UploadSolo";
import CollabRoom from "./pages/CollabRoom";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";

export default function App() {
  useEffect(() => {
    const channel = supabase
      .channel("invites")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "collab_invites" },
        payload => {
          alert(`You have been invited to a Collab Room`);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<UploadChoice />} />
        <Route path="/solo" element={<UploadSolo />} />
        <Route path="/collab" element={<CollabRoom />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
