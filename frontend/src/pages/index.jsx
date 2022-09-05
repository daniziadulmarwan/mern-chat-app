import {
  Box,
  Center,
  Container,
  TabList,
  Tabs,
  Text,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Signin from "../components/organisms/Signin";
import SignUp from "../components/organisms/Signup";

export default function Home() {
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"base"}
        borderWidth={"1px"}
      >
        <Center>
          <Text fontSize={"2xl"}>Chat App</Text>
        </Center>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"base"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList marginBottom={"1em"}>
            <Tab width={"50%"}>Sign In</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signin />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
