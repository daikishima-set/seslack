import React, { useState } from "react";
import styled from "styled-components";

const ThreadData = styled.div`
  margin: 10% 10%;
  width: 80%;
  height: 1.5rem;
  border-bottom: 1px #333 dashed;
  cursor: pointer;
  color: #aaa;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: purple;
  }
  &.updateThread {
    color: #333;
    font-weight: bold;
  }
`;

type Props = {
  name: string;
  tag: string;
  onThreadClick;
};

export default function Index(props: Props) {
  const { name, tag, onThreadClick } = props;

  return <ThreadData onClick={() => onThreadClick(tag)}>{name}</ThreadData>;
}
