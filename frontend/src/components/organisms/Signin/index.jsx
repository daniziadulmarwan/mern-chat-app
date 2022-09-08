import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const URL = "http://localhost:5000/api/user/signin";
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState([]);
  const [passError, setPassError] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(URL, { email, password });
      toast({
        title: "Login successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/chats");
    } catch (error) {
      setLoading(false);
      let arr = error.response.data;
      let email = [];
      let pass = [];

      arr.map((a) => {
        if (a.param === "email") email.push(a.msg);
        if (a.param === "password") pass.push(a.msg);
      });
      setEmailError(email);
      setPassError(pass);
    }
  };

  return (
    <VStack>
      <FormControl id="email" isRequired style={{ marginTop: "25px" }}>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          id={"email"}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
        />
        {emailError.length != 0 && (
          <FormHelperText color={"red"}>{emailError[0]}</FormHelperText>
        )}
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            id="password"
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
        {passError.length != 0 && (
          <FormHelperText color={"red"}>{passError[0]}</FormHelperText>
        )}
      </FormControl>

      <Button
        type="button"
        w={"100%"}
        colorScheme="telegram"
        borderRadius={"base"}
        style={{ marginTop: "25px" }}
        onClick={onSubmit}
        isLoading={loading}
      >
        Submit
      </Button>
    </VStack>
  );
}
