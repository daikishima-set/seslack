import React, { useState, useEffect, useRef } from "react";
import ROUTE, { Router, useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";

import Layout from "pages/components/base/Layout";
import ThreadList from "pages/components/g/ThreadList";
import TimelineList from "pages/components/g/TimelineList";
import Fetch from "utils/Fetch";
import Query from "utils/Query";
import Utils from "utils/Utils";
import { typeViewMode } from "ts/type";
import { VIEW_MODE } from "ts/const";

const Flame = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

type Props = {
  groupName: string;
  threadName: string;
  viewMode: typeViewMode;
};

export default function Index(props: Props) {
  const [threadList, setThreadList] = useState([]);
  const [timelineList, setTimelineList] = useState([]);
  const [updateTiming, setUpdateTiming] = useState(0);
  const [socket, setSocket] = useState(null);
  const router = useRouter();
  const { tag } = router.query;
  const [groupName, setGroupName] = useState(props.groupName);
  const [threadName, setThreadName] = useState(props.threadName);
  const [groupTag, setGroupTag] = useState(tag[0]);
  const [threadTag, setThreadTag] = useState(tag[1]);
  const [viewMode, setViewMode] = useState(props.viewMode);

  // コンストラクタ
  useEffect(() => {
    const f = async () => {
      const session = await getSession();
      if (session) {
        const data = {
          name: session.user.name,
          groupTag: groupTag,
        };
        Fetch.execute("post", Utils.url("/api/authGroupUser"), data).then(
          (result) => {
            if (result.msg) {
              setSocket(io(process.env.NEXT_PUBLIC_SOCKET_URL));
            } else {
              ROUTE.push("/");
            }
          }
        );
      }
    };
    f();
  }, []);

  useEffect(() => {
    const f = async () => {
      const session = await getSession();
      if (session) {
        if (socket) {
          socket.on("update", (data) => {
            if (data.groupTag == groupTag && data.threadTag == threadTag) {
              setUpdateTiming(new Date().getTime());
            } else {
              console.log("更新通知");
            }
            console.log("receive update");
          });
          const data = { name: session.user.name, groupTag: groupTag };
          socket.emit("login", data);

          return function cleanup() {
            socket.emit("logout");
          };
        }
      }
    };
    f();
  }, [socket]);

  useEffect(() => {
    let data: object = { groupTag: groupTag, threadTag: threadTag };
    Fetch.execute("post", Utils.url("/api/threadList"), data).then((result) => {
      setThreadList(result.thread);

      if (viewMode == VIEW_MODE.thread) {
        Fetch.execute("post", Utils.url("/api/threadData"), data).then(
          (result) => {
            setTimelineList(result.timeline);
            setThreadName(result.threadName);
            history.pushState("", "", "/g/" + groupTag + "/" + threadTag);
          }
        );
      } else if (viewMode == VIEW_MODE.search) {
        data = { groupTag: groupTag, key: threadName.substr(7) };
        Fetch.execute("post", Utils.url("/api/searchData"), data).then(
          (result) => {
            setTimelineList(result.timeline);
            setThreadName("Search " + result.threadName);
            history.pushState(
              "",
              "",
              "/g/" + groupTag + "/search=" + result.threadName
            );
          }
        );
      } else if (viewMode == VIEW_MODE.tag) {
        data = { groupTag: groupTag, key: threadName.substr(4) };
        Fetch.execute("post", Utils.url("/api/tagData"), data).then(
          (result) => {
            setTimelineList(result.timeline);
            setThreadName("Tag " + result.threadName);
            history.pushState(
              "",
              "",
              "/g/" + groupTag + "/tag=" + result.threadName
            );
          }
        );
      }
    });
  }, [groupTag, threadTag, updateTiming]);

  const onTweet = async (): Promise<any> => {
    const session = await getSession();
    if (session) {
      const data = {
        groupTag: groupTag,
        threadTag: threadTag,
        name: session.user.name,
      };
      setUpdateTiming(new Date().getTime());
      socket.emit("update", data);
    }
  };

  const onThreadClick = (tag): void => {
    setViewMode(VIEW_MODE.thread);
    setThreadTag(tag);
  };

  const onTagClick = (key): void => {
    setViewMode(VIEW_MODE.tag);
    setThreadName("Tag " + key);
    setThreadTag("tag=" + key);
  };

  const onSearch = (key): void => {
    setViewMode(VIEW_MODE.search);
    setThreadName("Search " + key);
    setThreadTag("search=" + key);
  };

  const onThreadUpdate = async (): Promise<any> => {
    const session = await getSession();
    if (session) {
      const data = {
        groupTag: groupTag,
        threadTag: threadTag,
        name: session.user.name,
      };
      setUpdateTiming(new Date().getTime());
      socket.emit("update", data);
    }
  };

  return (
    <Layout isAuth={true} groupName={groupName}>
      <Flame>
        <ThreadList
          list={threadList}
          groupTag={groupTag}
          onThreadClick={onThreadClick}
          onThreadUpdate={onThreadUpdate}
          onSearch={onSearch}
        />
        <TimelineList
          list={timelineList}
          threadName={threadName}
          threadTag={threadTag}
          onTweet={onTweet}
          onThreadUpdate={onThreadUpdate}
          viewMode={viewMode}
          onTagClick={onTagClick}
        />
      </Flame>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  let { tag } = query;

  let sql = `SELECT name FROM m_group WHERE tag = ?;`;
  let result = await Query(sql, [tag[0]]);
  const groupName = result[0].name;
  let threadName: string = "";
  let viewMode: typeViewMode;

  if (tag[1] && tag[1].startsWith("search=")) {
    threadName = "Search " + tag[1].split("=")[1];
    viewMode = VIEW_MODE.search;
  } else if (tag[1] && tag[1].startsWith("tag=")) {
    threadName = "Tag " + tag[1].split("=")[1];
    viewMode = VIEW_MODE.tag;
  } else {
    sql = `
    SELECT name, tag FROM m_thread WHERE group_id = (
      SELECT id FROM m_group WHERE tag = ?
    ) ORDER BY id asc LIMIT 1;
    `;
    result = await Query(sql, [tag[0]]);
    if (!tag[1]) {
      tag[1] = result[0].tag;
    }
    threadName = result[0].name;
    viewMode = VIEW_MODE.thread;
  }

  return {
    props: {
      tag: tag,
      groupName: groupName,
      threadName: threadName,
      viewMode: viewMode,
    },
  };
}
