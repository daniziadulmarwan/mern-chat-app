import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatProvider from "../context/ChatProvider";
import Home from "../pages";
import Chats from "../pages/chats";

export default function Router() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}
