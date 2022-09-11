import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const URL = "http://localhost:5000/api/user/signup";
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const imageUpload = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pic);
      formData.append("upload_preset", "mern-chat");
      formData.append("cloud_name", "mone");

      fetch("https://api.cloudinary.com/v1_1/mone/image/upload", {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url);
          setLoading(false);
          toast({
            title: "Image was uploaded",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        URL,
        { name, email, password, image },
        { headers: { "Content-Type": "application/json" } }
      );
      toast({
        title: "Register success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem("token", JSON.stringify(res.data.token));
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

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
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
        />
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

      {image === "" ? (
        <FormControl id="image" isRequired>
          <FormLabel>Image</FormLabel>
          <Input
            onChange={(e) => imageUpload(e.target.files[0])}
            type={"file"}
            p={1.5}
            id="image"
            accept={"image/*"}
          />
        </FormControl>
      ) : (
        <Box></Box>
      )}

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
