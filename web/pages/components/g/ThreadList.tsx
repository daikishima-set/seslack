import { useState } from "react";
import ThreadData from "./ThreadData";
import SearchThread from "./SearchThread";
import InputThread from "./InputThread";
import styled from "styled-components";
import { typeThread } from "ts/type";

const Menu = styled.div`
  width: 200px;
  height: 100%;
  background-color: #eeeff9;
`;

const ThreadList = styled.div`
  width: 100%;
  height: 95%;
  overflow-y: scroll;
  p {
    padding-left: 5%;
  }
`;
const BackGroup = styled.div`
  width: 100%;
  height: 3%;
  padding-left: 5%;
  color: #888;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: purple;
  }
  a {
    text-decoration: none;
  }
`;

type Props = {
  list: typeThread[];
  groupTag: string;
  onThreadClick;
  onThreadUpdate;
  onSearch;
};

export default function Index(props: Props) {
  const [threadList, setThreadList] = useState([]);
  const { list, groupTag, onThreadClick, onThreadUpdate, onSearch } = props;

  if (threadList && list && threadList.toString() !== list.toString()) {
    setThreadList(list.slice());
  }

  const listData = threadList.map((data) => (
    <ThreadData
      key={data.id}
      name={data.name}
      onThreadClick={onThreadClick}
      tag={data.tag}
    />
  ));

  return (
    <Menu>
      <ThreadList>
        <SearchThread onSearch={onSearch} />
        <p>Thread</p>
        {listData}
        <InputThread groupTag={groupTag} onThreadUpdate={onThreadUpdate} />
      </ThreadList>
      <BackGroup>
        <a href="/">≪ back group list</a>
      </BackGroup>
    </Menu>
  );
}
