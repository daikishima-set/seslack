import { useState } from 'react';
import styled from 'styled-components';
import { THREAD_SIZE } from 'ts/const';
import Fetch from 'utils/Fetch'
import Utils from 'utils/Utils'

const InputThread = styled.div`
text-align: center;
margin-top: 50px;
input{
    width: 80%;
    border: none;
    outline: none;
    border-bottom: 1px solid #333;
    background-color: transparent;
}
`

type Props = {
    groupTag: string, 
    onThreadUpdate
}

export default function Index(props: Props) {
    const [threadName, setThreadName] = useState("");
    const {groupTag, onThreadUpdate} = props;

    const addThread = (): void => {
        if (threadName.length <= 0) {
            return
        }
        const data = { groupTag: groupTag, threadName: threadName }
        Fetch.execute('post', Utils.url('/api/addThread'), data)
            .then((result) => {
                onThreadUpdate();
            });
    }

    const enterThread = (e): void => {
        if (e.charCode == 13) {
            addThread();
            setThreadName("");
        }
    }

    const inputThread = (e): void => {
        setThreadName(e.target.value);
    }

    return (
        <InputThread>
            <input type="text" value={threadName} onChange={inputThread} onKeyPress={enterThread} maxLength={THREAD_SIZE.name} autoComplete="off" placeholder="add thread" />
        </InputThread>
    );
}