import React, { useState } from "react";
import Fetch from "utils/Fetch";
import Utils from "utils/Utils";
import { useSession } from "next-auth/client";
import styled from "styled-components";
import { GROUP_SIZE } from "ts/const";

const GroupForm = styled.div`
  width: 100%;
  margin: 50px 0;
  > div:first-child {
    display: inline-flex;
    justify-content: center;
    width: 100%;
    input {
      border: none;
      outline: none;
      border-bottom: 1px solid #333;
      width: 90%;
      max-width: 300px;
      font-size: 1.5rem;
      text-align: center;
    }
    button {
      border: none;
      background-color: #384d98;
      color: #fff;
      width: 70px;
      height: 30px;
      cursor: pointer;
    }
  }
`;

const CandGroup = styled.div`
  position: relative;
  width: 90%;
  max-width: 300px;
  top: 0;
  left: calc(50% - 185px);
  > div {
    border-bottom: 1px dotted #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background-color: #eeeff9;
    }
  }
`;

type typeCandGroup = {
  name: string;
};

type Props = {
  candGroup: typeCandGroup[];
  updateGroupList;
};

export default function Index(props: Props) {
  const [groupName, setGroupName] = useState("");
  const [showCandGroup, setShowCandGroup] = useState(false);
  const [session, loading] = useSession();
  const { candGroup, updateGroupList } = props;

  const attachGroup = () => {
    if (!groupName) {
      return false;
    }
    const data: object = { name: session.user.name, groupName: groupName };

    Fetch.execute("post", Utils.url("/api/attachGroup"), data).then(
      (result) => {
        updateGroupList();
        setGroupName("");
      }
    );
  };

  const inputGroup = (e): void => {
    setGroupName(e.target.value);
    setShowCandGroup(true);
  };

  const setGroup = (e): void => {
    setGroupName(e.target.innerHTML);
    setShowCandGroup(false);
  };

  let cand: typeCandGroup[] = candGroup;
  if (!cand) {
    cand = [];
  }
  const candList: JSX.Element[] = cand
    .filter((data: typeCandGroup) => {
      if (groupName.length <= 0) {
        return;
      } else if (data.name.indexOf(groupName) >= 0) {
        return data;
      }
    })
    .map((data: typeCandGroup) => (
      <div key={data.name} onClick={setGroup}>
        {data.name}
      </div>
    ));

  return (
    <GroupForm>
      <div>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={inputGroup}
          maxLength={GROUP_SIZE.name}
          autoComplete="off"
          placeholder="Join the Group"
        />
        <button onClick={attachGroup}>Join</button>
      </div>
      <CandGroup>{showCandGroup && candList}</CandGroup>
    </GroupForm>
  );
}
