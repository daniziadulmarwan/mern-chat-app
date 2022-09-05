import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Chat() {
  const URL = "http://localhost:5000/api/chat";
  const [chats, setChats] = useState([]);

  const getChatAPI = async () => {
    const res = await axios.get(URL);
    setChats(res.data);
  };

  useEffect(() => {
    getChatAPI();
  }, []);

  return <div>Chat</div>;
}
