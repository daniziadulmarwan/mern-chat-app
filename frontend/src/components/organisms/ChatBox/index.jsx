import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../../context/ChatProvider";
import SingleChat from "../../molecules/SingleChat";

export default function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      background={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}
