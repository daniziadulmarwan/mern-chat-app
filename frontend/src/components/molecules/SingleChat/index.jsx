import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import ScrollableChat from "../../atoms/ScrollableChat";
import ProfileModal from "../../organisms/ProfileModal";
import UpdateGroupChatModel from "../UpdateGroupChatModel";
import "./messages.css";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const URL = "http://localhost:5000/api";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();
  const login = jwtDecode(user);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", login);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // console.log(newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  }, []);

  const getSender = (loggedUser, users) => {
    return users[0].id === loggedUser.id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0].id === loggedUser.id ? users[1] : users[0];
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
        const { data } = await axios.post(`${URL}/message`, {
          content: newMessage,
          chatId: selectedChat._id,
        });
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: `${error.message}`,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing indicator logic
  };

  async function fetchMessages() {
    if (!selectedChat) return;
    try {
      setLoading(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.get(`${URL}/message/${selectedChat._id}`);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(login, selectedChat.users)}
                <ProfileModal user={getSenderFull(login, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent="flex-end"
            p={3}
            bg={"#e8e8e8"}
            w={"100%"}
            h={"100%"}
            borderRadius="lg"
            overflowY={"hidden"}
          >
            {/* messages */}
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
              <Input
                variant={"filled"}
                bg="#e0e0e0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          h={"100%"}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
        >
          <Text pb={3} fontSize={"3xl"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}
