import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { ChatState } from "../../../context/ChatProvider";
import jwtDecode from "jwt-decode";
import ProfileModal from "../ProfileModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserList from "../../molecules/UserList";

export default function SideDrawer() {
  const URL = "http://localhost:5000/api";
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const login = jwtDecode(user);

  const navigate = useNavigate();
  const toast = useToast();

  const onSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const onSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter any keyword",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.get(`${URL}/user/?search=${search}`);
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      axios.defaults.headers.common = { Authorization: `Bearer ${user}` };
      const { data } = await axios.post(`${URL}/chat`, { userId });
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
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

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search user" hasArrow placement="bottom-end">
          <Button onClick={onOpen} variant={"ghost"} color="blackAlpha.900">
            <FiSearch />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontWeight={"bold"} color="orangered">
          OkaTalk
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon w={6} h={6} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={login.name}
                src={login.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={login}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search user</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={onSearch} isLoading={loading}>
                <Search2Icon />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}

            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
