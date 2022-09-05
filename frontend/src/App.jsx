import { Box } from "@chakra-ui/react";
import React from "react";
import Router from "./router";

export default function App() {
  return (
    <Box className="App" bg={"cyan.700"} h={"100vh"}>
      <Router />
    </Box>
  );
}
