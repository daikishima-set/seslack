import { useState } from "react";
import styled from "styled-components";

const InputThread = styled.div`
  text-align: center;
  margin: 10px 0 50px 0;
  input {
    width: 90%;
    border: none;
    outline: none;
    border-bottom: 1px solid #333;
    background-color: transparent;
  }
`;

type Props = {
  onSearch;
};

export default function Index(props: Props) {
  const [key, setKey] = useState("");
  const { onSearch } = props;

  const search = (): void => {
    if (key.length <= 0) {
      return;
    }
    onSearch(key);
  };

  const enterKey = (e): void => {
    if (e.charCode == 13) {
      search();
      setKey("");
    }
  };

  const inputKey = (e): void => {
    setKey(e.target.value);
  };

  return (
    <InputThread>
      <input
        type="text"
        value={key}
        onChange={inputKey}
        onKeyPress={enterKey}
        maxLength={128}
        autoComplete="off"
        placeholder="search ..."
      />
    </InputThread>
  );
}
