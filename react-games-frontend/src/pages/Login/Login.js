import {
  Box,
  Button,
  Container,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Stomp } from "@stomp/stompjs";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";

function Login() {
  const navigate = useNavigate();

  const checkInputs = () => {
    const userName = document.getElementById("username");
    const fullNameOrEmail = document.getElementById("fullNameOrEmail");

    if (userName.value!=="" && fullNameOrEmail.value!=="") {
      localStorage.setItem(
        "user",
        JSON.stringify({ userName: userName.value, fullNameOrEmail: fullNameOrEmail.value })
      );
      navigate("/games/home");
    }
    else{
        if(userName.value==""){
            userName.style.borderColor = "red"
        }
        if(fullNameOrEmail.value==""){
            fullNameOrEmail.style.borderColor = "red"
        }
    }
  };

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          React games
        </Text>
      </Box>
      <br />
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Input placeholder="UserName" id="username" />
              <br />
              <br />
              <Input placeholder="Full Name / Email" id="fullNameOrEmail" />
              <br />
              <br />
              <Button
                colorScheme="gray"
                variant="solid"
                style={{ width: "80%" }}
                onClick={() => checkInputs()}
              >
                Submit
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Login;
