import Head from "next/head";
import Router from "next/router";
import { useSession } from "next-auth/client";
import styled from "styled-components";
import Header from "./Header";

const Layout = styled.div`
  width: 100%;
  height: 100%;
  main {
    height: calc(100% - 50px);
  }
`;

type Props = {
    isAuth: boolean,
    groupName?: string, 
    children: JSX.Element | JSX.Element[]
}

export default function Index(props: Props) {
  const [session, loading] = useSession();
  const {isAuth, groupName, children} = props;

  if (isAuth !== false) {
    if (loading) return null;
    if (!loading && !session) {
      Router.push("/login");
      return null;
    }
  }

  return (
    <Layout>
      <Head>
        <title>SESlack</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header groupName={groupName} />

      <main>{children}</main>

      <footer></footer>
    </Layout>
  );
}
