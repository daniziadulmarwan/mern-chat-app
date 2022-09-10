import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../context/ChatProvider";
import UserBadge from "../UserBadge";
import axios from "axios";
import UserList from "../UserList";
import jwtDecode from "jwt-decode";

export default function UpdateGroupChatModel({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) {
  const URL = "http://localhost:5000/api";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const login = jwtDecode(user);

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRename = async () => {
    setRenameLoading(true);
    if (!groupChatName) return;
    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.put(`${URL}/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (keyword) => {
    setSearch(keyword);
    if (!keyword) {
      return;
    }
    try {
      setLoading(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.get(`${URL}/user?search=${search}`);
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      toast({
        title: "Error occured",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleAddUser = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== login.id) {
      toast({
        title: "Only admin can add member",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.put(`${URL}/chat/addgroup`, {
        chatId: selectedChat._id,
        userId: addUser._id,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (userChoosed) => {
    if (
      selectedChat.groupAdmin._id !== login.id &&
      userChoosed._id !== login.id
    ) {
      toast({
        title: "Only admin can remove member",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.put(`${URL}/chat/removegroup`, {
        chatId: selectedChat._id,
        userId: userChoosed._id,
      });
      userChoosed._id === login.id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  console.log(selectedChat.users);

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={onOpen}
        icon={<ViewIcon />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display="flex" pb={2} flexWrap={"wrap"}>
              {selectedChat.users.map((item) => (
                <UserBadge
                  key={item._id}
                  user={item}
                  handleClick={() => handleRemove(item)}
                />
              ))}
            </Box>

            <FormControl
              display={"flex"}
              gap={1}
              justifyContent={"space-between"}
            >
              <Input
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Chat name"
                mb={3}
              />
              <Button
                type="button"
                colorScheme="teal"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Go
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete={"off"}
              />
            </FormControl>

            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((item) => (
                <UserList
                  key={item._id}
                  user={item}
                  handleFunction={() => handleAddUser(item)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              colorScheme="red"
              w={"100%"}
              onClick={() => handleRemove(login)}
            >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
