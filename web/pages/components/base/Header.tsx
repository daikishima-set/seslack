import { useSession } from "next-auth/client";
import { signout } from "next-auth/client";
import styled from "styled-components";

const Header = styled.header`
  position: relative;
  width: 100%;
  height: 50px;
  top: 0;
  left: 0;
  background-color: #384d98;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-right: 1%;
    > div {
      margin: 0 15px;
      height: 100%;
    }
    > div:first-child {
      width: auto;
      max-width: 80%;
    }
    > div:last-child {
      width: 20%;
      min-width: 200px;
      justify-content: space-around;
    }
    span {
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  a {
    color: #fff;
  }
`;

type Props = {
  groupName: string,
}

export default function Index(props: Props) {
  const [session, loading] = useSession();
  const {groupName} = props;

  return (
    <Header>
      {session && (
        <div>
          <div>{groupName && <span>Group:　{groupName}</span>}</div>
          <div>
            <span>{session.user.name}</span>
            <a
              href="/api/auth/signout"
              onClick={(e) => {
                e.preventDefault();
                signout();
              }}
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </Header>
  );
}
