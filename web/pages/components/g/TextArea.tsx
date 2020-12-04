import React, { useState } from "react";
import Fetch from "utils/Fetch";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import { TIMELINE_SIZE } from "ts/const";

const TextArea = styled.div`
  height: 100%;
  width: 100%;
  display: inline-flex;
  textarea {
    width: 80%;
    max-width: 800px;
    height: 60px;
    resize: none;
    margin-right: 5px;
  }
  button {
    width: 90px;
    height: 60px;
    border: none;
    font-size: 1.0rem;
    color: #fff;
    background-color: #384d98;
  }
`;

type Props = {
  threadTag: string;
  onTweet;
};

export default function Input(props: Props) {
  const [message, setMessage] = useState("");
  const {threadTag, onTweet} = props;

  const sendMessage = async (): Promise<any> => {
    if (!message) {
      return;
    }

    const session = await getSession();
    if (session) {
      const data = {
        user: session.user.name,
        threadTag: threadTag,
        message: message,
      };

      Fetch.execute(
        "post",
        process.env.NEXT_PUBLIC_APP_URL + "/api/addTimeline",
        data
      ).then((result) => {
        setMessage("");
        onTweet();
      });
    }
  };

  const inputMessage = (e): void => {
    if (e.charCode !== 13) {
      setMessage(e.target.value);
    }
  };

  const onKeyPress = (e): void => {
    if (e.charCode == 13) {
      if (e.ctrlKey) {
        setMessage(e.target.value + "\n");
      } else {
        sendMessage();
      }
    }
  };

  return (
    <TextArea>
      <textarea
        value={message}
        onChange={inputMessage}
        onKeyPress={onKeyPress}
        maxLength={TIMELINE_SIZE.message}
      ></textarea>
      <button onClick={sendMessage}>send</button>
    </TextArea>
  );
}
