import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Signin() {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    console.log(email);
  };

  return (
    <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
          />
          <InputRightElement>
            <Button
              borderTopLeftRadius={"none"}
              borderBottomLeftRadius={"none"}
              onClick={() => setShow(!show)}
            >
              <Icon as={show ? FiEye : FiEyeOff} w={4} h={4} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        type="button"
        w={"100%"}
        colorScheme="telegram"
        borderRadius={"base"}
        style={{ marginTop: "25px" }}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </VStack>
  );
}
