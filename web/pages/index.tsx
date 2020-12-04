import Layout from './components/base/Layout'
import { getSession } from 'next-auth/client'
import Fetch from '../utils/Fetch'
import Utils from '../utils/Utils'
import GroupList from './components/index/GroupList'
import GroupForm from './components/index/GroupForm'
import { useEffect, useState, useRef } from 'react'

export default function Index() {
  const [groupList, setGroupList] = useState([]);
  const [allGroupList, setAllGroupList] = useState([]);

  const is_first = useRef(true);

  useEffect(() => {
    if(is_first.current){
      updateGroupList();
      is_first.current = false;
    }
  },[])

  const updateGroupList = async () => {
    const session = await getSession()
    if (session) {
      const data = { name: session.user.name }
      Fetch.execute('post', Utils.url('/api/groupData'), data)
        .then((result) => {
          setGroupList(result.group);
          setAllGroupList(result.allGroup);
        });
      return null;
    }
  }

  return (
    <Layout isAuth={true}>
      <GroupList list={groupList} />
      <GroupForm updateGroupList={updateGroupList} candGroup={allGroupList} />
    </Layout>
  )
}
