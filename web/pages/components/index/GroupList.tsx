import React from "react";
import GroupData from "./GroupData";
import Utils from "utils/Utils";
import styled from "styled-components";
import { typeGroup } from "ts/type";

const GroupList = styled.div`
  width: 100%;
  > p {
    width: 80%;
    margin: 10px auto;
    font-size: 1.5rem;
  }
  > div {
    display: flex;
    flex-direction: row;
    width: 80%;
    margin: 0 auto;
    flex-wrap: wrap;
  }
`;

type Props = {
  list: typeGroup[];
};

export default function Index(props: Props) {
  let { list } = props;
  if (!list) {
    list = [];
  }
  const listData = list.map((data: typeGroup) => (
    <GroupData
      key={data.id}
      name={data.name}
      url={Utils.url(`/g/${data.tag}`)}
    />
  ));

  return (
    <GroupList id="groupList">
      <p>My Group</p>
      <div>{listData}</div>
    </GroupList>
  );
}
