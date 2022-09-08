import { Box } from "@chakra-ui/react";
import ChatBox from "../components/organisms/ChatBox";
import MyChats from "../components/organisms/MyChats";
import SideDrawer from "../components/organisms/SideDrawer";
import { ChatState } from "../context/ChatProvider";

export default function Chats() {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent="space-between"
        w={"100%"}
        h="91.5vh"
        p={"10px"}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}
