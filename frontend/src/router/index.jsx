import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages";
import Chat from "../pages/chat";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
