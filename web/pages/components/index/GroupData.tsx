import React from "react";
import styled from "styled-components";

const GroupLink = styled.a`
  text-decoration: none;
`;

const GroupData = styled.div`
  width: 200px;
  height: 150px;
  margin: 10px 10px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  overflow: hidden;
  padding: 5px;
  color: #333;
  &:hover {
    background-color: #eeeff9;
  }
`;

type Props = {
  name: string;
  url: string;
};

export default function Index(props: Props) {
  const { name, url } = props;

  return (
    <GroupLink href={url}>
      <GroupData>
        <div>{name}</div>
      </GroupData>
    </GroupLink>
  );
}
