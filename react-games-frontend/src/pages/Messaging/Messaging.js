import React, { useEffect, useState } from "react";
import "./Messaging.css";
import axios from "axios";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function Messaging() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [connectedUsersList, setConnectedUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(() => {
    const user = localStorage.getItem("user");
    if (user) {
      let savedUser = JSON.parse(user);
      return savedUser;
    } else {
      return { userName: "" };
    }
  });
  const socket = new SockJS("https://react-games-bbt8.onrender.com/ws");
  const [stompClient, setStompClient] = useState(Stomp.over(socket));

  const onConnected = () => {
    stompClient.debug = () => {};
    stompClient.subscribe(
      `/user/${data.userName}/queue/messages`,
      onMessageReceived
    );
    stompClient.subscribe("/user/topic", onMessageReceived);

    //register Connected user
    stompClient.send(
      "/app/user.addUser",
      {},
      JSON.stringify({
        nickName: data.userName,
        fullName: data.fullNameOrEmail,
        status: "ONLINE",
      })
    );

    //Get connected Users
    findAndDisplayConnectedUsers().then();
  };

  const onError = (err) => {
    console.error(err);
  };
  const onMessageReceived = (message) => {
    const body = JSON.parse(message.body);
    const targetUser = localStorage.getItem("targetUser");
    const timeStamp = new Date().toISOString();
    console.log("Body : ", body);
    console.log("Selected User : ", targetUser);
    console.log("Selected User : ", messages);
    if (targetUser) {
      if (body.senderId === targetUser && "content" in body) {
        displayMessage(body.senderId, body.content, timeStamp);
      }
    }

    if ("status" in body) {
      findAndDisplayConnectedUsers();
    }
  };
  const specificChatsView = (event) => {
    const allChats = document.getElementById("all-chats");
    const specificChat = document.getElementById("specific-chat");
    const backButton = document.getElementById("back-button");
    allChats.style.display = "none";
    specificChat.style.display = "block";
    backButton.style.display = "block";

    localStorage.setItem("targetUser", event.currentTarget.id);
    setSelectedUser(event.currentTarget.id);
    fetchAndDisplayUserChat(event.currentTarget.id).then();
  };
  const allChatsView = () => {
    const chatArea = document.querySelector(".chats-window");
    chatArea.innerHTML = "";
    const allChats = document.getElementById("all-chats");
    const specificChat = document.getElementById("specific-chat");
    const backButton = document.getElementById("back-button");
    allChats.style.display = "block";
    specificChat.style.display = "none";
    backButton.style.display = "none";

    setSelectedUser("");
  };

  const sendMessage = () => {
    const messageContent = document.getElementById("chat-message");
    if (messageContent !== "" && stompClient.connected) {
      console.log("Sending Message");
      const chatMessage = {
        senderId: data.userName,
        recipientId: selectedUser,
        content: messageContent.value.trim(),
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

      displayMessage(
        data.userName,
        messageContent.value.trim(),
        new Date().toISOString()
      );
      messageContent.value = "";
      messageContent.focus();
    }
  };
  const findAndDisplayConnectedUsers = async () => {
    const connectedUserResponse = await fetch(
      "https://react-games-bbt8.onrender.com/users"
    );
    let connectedUsers = await connectedUserResponse.json();
    connectedUsers = connectedUsers.filter(
      (user) => user.nickName !== data.userName
    );

    setConnectedUsersList(connectedUsers);
    console.log(connectedUsers);
  };
  const fetchAndDisplayUserChat = async (recipientId) => {
    const userChatResponse = await fetch(
      `https://react-games-bbt8.onrender.com/messages/${data.userName}/${recipientId}`
    );
    const userChat = await userChatResponse.json();
    userChat.sort((a, b) => a.timestamp - b.timestamp);

    userChat.forEach((chat) => {
      displayMessage(chat.senderId, chat.content, chat.timestamp);
    });
  };

  const displayMessage = (senderId, content, timestamp) => {
    const chatArea = document.querySelector(".chats-window");
    let shortFormDate = "";
    let shortFormTime = "";
    if (timestamp) {
      shortFormDate = new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      shortFormTime = new Date(timestamp).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      shortFormDate = new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      shortFormTime = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const dateTime = `${shortFormTime}~${shortFormDate}`;

    const messageContainer = (
      <div
        className={`message ${
          senderId === data.userName ? "sender" : " receiver"
        }`}
      >
        <section>
          <p>{senderId}</p>
          <p>{dateTime}</p>
        </section>
        <p style={{ padding: "5px 10px" }}>{content}</p>
      </div>
    );
    setMessages((prevMessages) => [...prevMessages, messageContainer]);
    chatArea.scrollTop = chatArea.scrollHeight;
  };

  useEffect(() => {
    if (data.userName === "") {
      navigate("/login");
    } else {
      console.log(stompClient);
      setStompClient((prevClient) => {
        prevClient.reconnectDelay = 5000;
        prevClient.connect({}, onConnected, onError);
        prevClient.onClose = () => {
          console.log("Connection Close");
        };
        return prevClient;
      });
    }
  }, []);

  useEffect(() => {
    const imageElement = document.querySelector(".msg-icon");
    imageElement.addEventListener("click", onOpen);
  }, []);
  return (
    <div>
      <img
        className="msg-icon"
        src="react-games/assets/images/message_icon.png"
        alt="msg-icon"
      />

      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent className="chats-container">
          <DrawerHeader className="chat-header">
            <button
              style={{ outline: "0", border: "none", display: "none" }}
              id="back-button"
              onClick={allChatsView}
            >
              ←
            </button>
            <p style={{ margin: "auto" }}>{selectedUser}</p>
            <DrawerCloseButton style={{ margin: "10px" }} />
          </DrawerHeader>

          <DrawerBody
            style={{
              backgroundColor: "#5C5470",
              borderRadius: "15px 15px 0px 0px",
            }}
          >
            <ul id="all-chats">
              {connectedUsersList.map((user) => {
                return (
                  <li
                    key={user.nickName}
                    className="chat-item"
                    onClick={specificChatsView}
                    id={user.nickName}
                  >
                    <p className="chat">
                      <span>
                        {" "}
                        <span className={`status-${user.status}`}></span>
                        &nbsp;{user.nickName}
                      </span>
                      <span style={{ color: "gray" }}>~{user.fullName}</span>
                    </p>
                    <hr style={{ width: "100%" }} />
                  </li>
                );
              })}
            </ul>
            <div id="specific-chat" style={{ display: "none", height: "100%" }}>
              <div className="chats-window">{messages}</div>
              <div style={{ height: "8%" }}>
                <InputGroup size="md">
                  <Input
                    id="chat-message"
                    bg={"white"}
                    color={"black"}
                    placeholder="Enter message..."
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={sendMessage}>
                      Send
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Messaging;
