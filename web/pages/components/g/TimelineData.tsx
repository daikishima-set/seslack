import React, { useRef, useState } from "react";
import { useSession } from "next-auth/client";
import InputTag from "./InputTag";
import styled from "styled-components";
import { typeViewMode } from "ts/type";
import { VIEW_MODE } from "ts/const";
import Utils from "utils/Utils";
import Fetch from "utils/Fetch";

const TimelineData = styled.div`
  width: 95%;
  padding: 10px 10px;

  &:nth-child(n + 2) {
    border-top: 1px dashed #333;
  }

  &:nth-child(even) {
    background-color: #f3f4fe;
  }

  &:hover > div > div.custom {
    opacity: 1;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  overflow: hidden;
  font-size: 0.75rem;
  color: #888;
  div {
    margin-right: 10px;
    overflow: hidden;
    white-space: nowrap;
  }
  div:nth-child(2) {
    text-align: left;
  }
  div.custom {
    opacity: 0;
  }
`;

const CustomTimeline = styled.div`
  border-bottom: 1px solid #888;
  padding: 0 5px;
  cursor: pointer;
  user-select: none;
`;

const Message = styled.div`
  margin-top: 10px;
  white-space: pre-wrap;
  min-height: 30px;
  width: 100%;
  textarea {
    width: 100%;
    max-width: 800px;
    height: 60px;
    resize: none;
    margin-right: 5px;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
  font-size: 0.75rem;
  width: 100%;
  color: #aaa;
`;
const Tag = styled.div`
  &:nth-child(n + 2) {
    border-bottom: 1px dashed #ccc;
    background-color: #fff;
    cursor: pointer;
    &:hover {
      color: #333;
    }
  }
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

type Props = {
  id: number;
  name: string;
  message: string;
  updatedAt: string;
  tagList: string[];
  mode: typeViewMode;
  onTagClick;
  onThreadUpdate;
};

export default function Index(props: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [session, loading] = useSession();
  const refMessage = useRef(null);
  const {
    mode,
    id,
    name,
    message,
    updatedAt,
    tagList,
    onTagClick,
    onThreadUpdate,
  } = props;

  const clickTag = (e) => {
    onTagClick(e.target.innerHTML);
  };

  let tags: string[] = [];
  if (tagList) {
    tags = tagList;
    tags.sort((a: string, b: string) => {
      return a[1] < b[1] ? 1 : 0;
    });
  }

  const tagData = tags.map((data) => (
    <Tag key={data[0]} onClick={clickTag}>
      {data[1]}
    </Tag>
  ));

  const updateTimeline = async (e): Promise<any> => {
    if (session) {
      const data = {
        user: session.user.name,
        timelineId: e.currentTarget.getAttribute("data-id"),
        message: editMessage,
      };
      Fetch.execute("post", Utils.url("/api/editTimeline"), data).then(
        (result) => {
          onThreadUpdate();
        }
      );
    }
  };

  const editTimeline = (e): void => {
    if (!isEdit) {
      setEditMessage(refMessage.current.innerHTML);
    } else {
      setEditMessage("");
    }

    setIsEdit(!isEdit);
  };

  const inputEditMessage = (e): void => {
    if (e.charCode !== 13) {
      setEditMessage(e.target.value);
    }
  };

  const onKeyPress = (e): void => {
    if (e.charCode == 13) {
      if (e.ctrlKey) {
        setEditMessage(e.target.value + "\n");
      } else {
        updateTimeline(e);
        setIsEdit(false);
      }
    }
  };

  const deleteTimeline = async (e): Promise<any> => {
    if (session) {
      const data = {
        user: session.user.name,
        timelineId: e.currentTarget.getAttribute("data-id"),
      };
      Fetch.execute("post", Utils.url("/api/deleteTimeline"), data).then(
        (result) => {
          onThreadUpdate();
        }
      );
    }
  };

  return (
    <TimelineData>
      <Header>
        <div>{name}</div>
        <div>{updatedAt}</div>
        {session && session.user.name == name && (
          <>
            <CustomTimeline
              className="custom"
              onClick={editTimeline}
              data-id={id}
            >
              {isEdit && <span>キャンセル</span>}
              {!isEdit && <span>編集</span>}
            </CustomTimeline>
            <CustomTimeline
              className="custom"
              onClick={deleteTimeline}
              data-id={id}
            >
              <span>削除</span>
            </CustomTimeline>
          </>
        )}
      </Header>
      <Message>
        {isEdit && (
          <textarea
            value={editMessage}
            data-id={id}
            data-message={message}
            onChange={inputEditMessage}
            onKeyPress={onKeyPress}
          ></textarea>
        )}
        {!isEdit && <span ref={refMessage}>{message}</span>}
      </Message>
      <TagList>
        <div>tag:　</div>
        {tagData}
        {mode == VIEW_MODE.thread && (
          <InputTag key={id} id={id} onThreadUpdate={onThreadUpdate} />
        )}
      </TagList>
    </TimelineData>
  );
}
