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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../context/ChatProvider";
import UserBadge from "../UserBadge";
import axios from "axios";

export default function UpdateGroupChatModel({ fetchAgain, setFetchAgain }) {
  const URL = "http://localhost:5000/api";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();

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

  const handleRemove = () => {};

  const handleSearch = () => {};

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
