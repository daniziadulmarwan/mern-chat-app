import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import UserBadge from "../../molecules/UserBadge";
import UserList from "../../molecules/UserList";

export default function GroupChatModal({ children }) {
  const URL = "http://localhost:5000/api";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const onSearch = async (keyword) => {
    setSearch(keyword);
    if (!keyword) {
      return;
    }
    try {
      setLoading(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.get(`${URL}/user?search=${search}`);
      console.log(data.users);
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error occured",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User added",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((s) => s._id !== delUser._id));
  };

  const onSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill the field",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.post(`${URL}/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New group chat created",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"25px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                onChange={(e) => onSearch(e.target.value)}
                autoComplete={"off"}
              />
            </FormControl>

            {selectedUsers.map((item) => (
              <UserBadge
                key={item._id}
                user={item}
                handleClick={() => handleDelete(item)}
              />
            ))}

            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((item) => (
                  <UserList
                    key={item._id}
                    user={item}
                    handleFunction={() => handleGroup(item)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onSubmit}
              type="button"
              colorScheme="blue"
              width={"100%"}
              mr={3}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
