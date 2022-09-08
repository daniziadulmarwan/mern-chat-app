import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

export default function UserList({ handleFunction, user }) {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg="#e8e8e8"
      _hover={{
        background: "#38b2ac",
        color: "white",
      }}
      w={"100%"}
      display={"flex"}
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor={"pointer"}
        name={user.name}
        src={user.image}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize={"sm"}>{user.email}</Text>
      </Box>
    </Box>
  );
}
