import { useState } from "react";
import Fetch from "utils/Fetch";
import Utils from "utils/Utils";
import styled from "styled-components";
import { TAG_SIZE } from "ts/const";

const InputTag = styled.div`
  border-bottom: none;
  input {
    width: 80px;
    border: none;
    outline: none;
    border-bottom: 1px solid #333;
    background-color: transparent;
    text-align: center;
  }
`;

type Props = {
  id: number;
  onThreadUpdate;
};

export default function Index(props: Props) {
  const [tagName, setTagName] = useState("");
  const { id, onThreadUpdate } = props;

  const addTag = () => {
    if (tagName.length <= 0) {
      return;
    }
    const data = { timelineId: id, tagName: tagName };
    Fetch.execute("post", Utils.url("/api/addTag"), data).then((result) => {
      onThreadUpdate();
    });
  };

  const enterTag = (e): void => {
    if (e.charCode == 13) {
      addTag();
      setTagName("");
    }
  };

  const inputTag = (e): void => {
    setTagName(e.target.value.replace(/(,|:)/g, ""));
  };

  return (
    <InputTag>
      <input
        type="text"
        value={tagName}
        onChange={inputTag}
        onKeyPress={enterTag}
        maxLength={TAG_SIZE.name}
        autoComplete="off"
        placeholder="add"
      />
    </InputTag>
  );
}
