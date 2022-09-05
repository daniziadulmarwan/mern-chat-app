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
import React, { useState } from "react";

export default function SignUp() {
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const onSubmit = () => {};

  return (
    <VStack>
      <FormControl id="name" isRequired>
        <FormLabel>Fullname</FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type={"text"}
        />
      </FormControl>

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

      <FormControl id="email" isRequired>
        <FormLabel>Image</FormLabel>
        <Input
          onChange={(e) => setImage(e.target.files[0])}
          type={"file"}
          p={1.5}
          accept={"image/*"}
        />
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
