import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { typeTimeline, typeViewMode } from "ts/type";
import TextArea from "./TextArea";
import TimelineData from "./TimelineData";

const ThreadList = styled.div`
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 202px);
  height: 100%;
`;

const ThreadName = styled.div`
  width: 100%;
  font-size: 2rem;
  height: 60px;
`;

const ThreadData = styled.div`
  width: 100%;
  height: calc(100% - 150px);
  width: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ThreadBottom = styled.div`
  width: 100%;
  height: 80px;
  width: 100%;
`;

type Props = {
  list: any[];
  threadName: string;
  threadTag: string;
  viewMode: typeViewMode;
  onThreadUpdate;
  onTagClick;
  onTweet;
};

export default function Index(props: Props) {
  const threadData = useRef(null);

  const { list, threadName, threadTag, viewMode, onThreadUpdate, onTagClick, onTweet } = props;

  let timelineList = list;
  if (!timelineList) {
    timelineList = [];
  }

  useEffect(() => {
    threadData.current.scrollTop = threadData.current.scrollHeight;
  }, [props.list]);

  let listData: JSX.Element | JSX.Element[] = <p>このスレッドはまだ投稿されていません</p>;;
  if (list && list.length > 0) {
    listData = list.map((data) => (
      <TimelineData
        key={data.id}
        id={data.id}
        name={data.name}
        updatedAt={data.updatedAt}
        message={data.message}
        tagList={data.tagList}
        onThreadUpdate={onThreadUpdate}
        mode={viewMode}
        onTagClick={onTagClick}
      />
    ));
  }
  return (
    <ThreadList>
      <ThreadName>{threadName}</ThreadName>
      <ThreadData ref={threadData}>{listData}</ThreadData>
      <ThreadBottom>
        <TextArea onTweet={onTweet} threadTag={threadTag} />
      </ThreadBottom>
    </ThreadList>
  );
}
