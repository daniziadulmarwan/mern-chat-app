import { Box } from "@chakra-ui/react";
import { useState } from "react";
import ChatBox from "../components/organisms/ChatBox";
import MyChats from "../components/organisms/MyChats";
import SideDrawer from "../components/organisms/SideDrawer";
import { ChatState } from "../context/ChatProvider";

export default function Chats() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

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
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}
