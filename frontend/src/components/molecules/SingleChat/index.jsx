import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import React from "react";
import { ChatState } from "../../../context/ChatProvider";
import ProfileModal from "../../organisms/ProfileModal";
import UpdateGroupChatModel from "../UpdateGroupChatModel";

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const login = jwtDecode(user);

  const getSender = (loggedUser, users) => {
    return users[0].id === loggedUser.id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0].id === loggedUser.id ? users[1] : users[0];
  };

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
          ></Box>
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
