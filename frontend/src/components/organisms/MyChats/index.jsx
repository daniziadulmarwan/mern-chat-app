import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import GroupChatModal from "../GroupChatModal";

export default function MyChats() {
  const URL = "http://localhost:5000/api";
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const token = localStorage.getItem("token");
  const login = jwtDecode(token);

  const fetchChat = async () => {
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.get(`${URL}/chat`);
      setChats(data);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(login);
    fetchChat();
  }, []);

  const getSender = (loggedUser, users) => {
    return users[0].id === loggedUser.id ? users[1].name : users[0].name;
  };

  return (
    <Box
      display={{ base: selectedChat ? " none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      h={"100%"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        Chats
        <GroupChatModal>
          <Button
            d={"flex"}
            fontSize={{ base: "14px", md: "10px", lg: "14px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"column"}
        p={3}
        bg={"#f8f8f8"}
        w={"100%"}
        h={"100%"}
        borderRadius="lg"
        overflowY={"hidden"}
      >
        {chats.length ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}
