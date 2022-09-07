import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
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
  const [alerts, setAlerts] = useState([]);

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
      let dat = [];
      arr.map((a) => {
        if (a.param === "email") dat.push(a.msg);
      });
      setAlerts(dat);
    }
  };

  console.log(alerts);

  return (
    <VStack>
      {/* {alerts.length && (
        <Alert status="error">
          <AlertIcon />
          {alerts[0]}
        </Alert>
      )} */}

      <FormControl id="email" isRequired style={{ marginTop: "25px" }}>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          id={"email"}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
        />
        {alerts.length != 0 && (
          <FormHelperText color={"red"}>{alerts[0]}</FormHelperText>
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
