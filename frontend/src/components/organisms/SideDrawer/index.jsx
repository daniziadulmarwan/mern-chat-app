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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../context/ChatProvider";
import jwtDecode from "jwt-decode";
import ProfileModal from "../ProfileModal";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user } = ChatState();
  const login = jwtDecode(user);

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
          <Button variant={"ghost"} color="blackAlpha.900">
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
              <MenuItem>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
}
