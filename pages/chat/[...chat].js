import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
//uuid
import { v4 as uuidv4 } from "uuid";
//socket
import socketIOClient from "socket.io-client";

import Input from "./../../components/Input";
import Messages from "./../../components/Messages";
import axios from "axios";
import { env } from "process";

const SERVER_URL = env.SERVER_URL || "https://app-app-32.herokuapp.com";
//components
const socket = socketIOClient(SERVER_URL);

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const chatBody = useRef();

  const sendMessage = (message) => {
    const data = {
      ...user,
      message,
      room: router.query.chat[0],
      time: new Date(),
    };
    setMessages([...messages, data]);

    socket.emit("send", data);
    axios.post(`${SERVER_URL}/newMessage`, data);
  };

  useEffect(() => {
    if (router.query.chat === undefined) {
      return;
    }

    const userData = {
      username: router.query.chat[1],
      password: router.query.chat[2],
      id: uuidv4(),
    };

    const signIn = async () => {
      const response = await axios.post(`${SERVER_URL}/bd`, {
        username: router.query.chat[1],
        password: router.query.chat[2],
      });

      // //receive socketid
      // socket.on('socketid', (socketid) => {
      //     console.log('socketid: ', socketid)
      // })
      //if don't exist user in db create new user
      if (response.data.length === 0) {
        const response = await axios.post(SERVER_URL + "/register", userData);
        setUser({
          author: router.query.chat[1],
          id: userData.id,
        });
      }
      else{ 
        setUser({ author: router.query.chat[1], id: response.data.id });
      }
      socket.emit("connection");
      socket.emit("join", router.query.chat[0]);
    };
    signIn();

    //receive messages
    const loadOldMessages = () =>
      axios
        .post(`${SERVER_URL}/messages`, {
          room: router.query.chat[0],
        })
        .then((response) => {
          setMessages(response.data);
        });
    loadOldMessages();

    setUser(userData);
  }, [router.query]);

  useEffect(() => {
    if (router.query.chat === undefined) {
      return;
    }

    socket.on("receive", (data) => {
      setMessages([...messages, data]);
    });

    if (chatBody.current)
      chatBody.current.scrollTop = chatBody.current.scrollHeight;
  }, [messages]);

  if (router.query.chat === undefined) {
    return <div>No hay chat</div>;
  }

  return (
    <div className="chat">
      <div className="chat-subject">
        <span>Ruta: {router.query.chat[0]}</span>
      </div>
      <div className="chat-body" ref={chatBody}>
        <Messages messages={messages} user={user.author} />
      </div>
      <div className="message-input">
        <Input sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
