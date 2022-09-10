import { Avatar, Tooltip } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../../context/ChatProvider";

export default function ScrollableChat({ messages }) {
  const { user } = ChatState();
  const login = jwtDecode(user);

  function isSameSender(messages, m, i, userId) {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  }

  function isLastMessage(messages, i, userId) {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  }

  function isSameSenderMargin(messages, m, i, userId) {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    ) {
      return 33;
    } else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    ) {
      return 0;
    } else {
      return "auto";
    }
  }

  function isSameUser(messages, m, i) {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  }

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, login.id) ||
              isLastMessage(messages, i, login.id)) && (
              <Tooltip
                label={m.sender.name}
                placement={"bottom-start"}
                hasArrow
              >
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.image}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === login.id ? "#bee3f8" : "#b9f5d0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, login.id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}
