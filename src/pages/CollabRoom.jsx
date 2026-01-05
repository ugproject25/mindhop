import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";

export default function CollabRoom() {
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [emails, setEmails] = useState("");

  useEffect(() => {
    if (!room) return;

    const channel = supabase
      .channel("room-members")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "collab_members" },
        fetchMembers
      )
      .subscribe();

    fetchMembers();
    return () => supabase.removeChannel(channel);
  }, [room]);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("collab_members")
      .select("*")
      .eq("room_id", room.id);

    setMembers(data || []);
  };

  const createRoom = async () => {
    setCreating(true);

    const user = (await supabase.auth.getUser()).data.user;
    const { data } = await supabase
      .from("collab_rooms")
      .insert({ creator_id: user.id })
      .select()
      .single();

    await supabase.from("collab_members").insert({
      room_id: data.id,
      user_id: user.id,
    });

    setRoom(data);
    setCreating(false);
  };

  const sendInvites = async () => {
    const list = emails.split(",").map(e => e.trim());
    if (list.length > 10) return alert("Max 10 invites");

    for (let email of list) {
      await supabase.from("collab_invites").insert({
        room_id: room.id,
        invited_user_email: email,
      });
    }

    alert("Invites sent");
  };

  return (
    <motion.div
      className="card"
      style={{ maxWidth: 700, margin: "60px auto" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Collab Room</h2>

      <AnimatePresence>
        {!room && (
          <motion.div
            key="create"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button onClick={createRoom} disabled={creating}>
              {creating ? "Creating room..." : "Create Room"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {room && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p style={{ marginTop: 10 }}>
              Status: <b>{members.length >= 3 ? "Ready" : "Waiting"}</b>
            </p>

            <input
              placeholder="invite1@email.com, invite2@email.com"
              onChange={e => setEmails(e.target.value)}
            />

            <button style={{ marginTop: 12 }} onClick={sendInvites}>
              Send Invites
            </button>

            <h3 style={{ marginTop: 20 }}>
              Members ({members.length})
            </h3>

            <ul>
              {members.map(m => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {m.user_id}
                </motion.li>
              ))}
            </ul>

            <button disabled={members.length < 3}>
              Upload (min 3 members)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
