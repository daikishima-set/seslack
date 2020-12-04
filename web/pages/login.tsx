import Layout from './components/base/Layout'
import { csrfToken } from 'next-auth/client'
import styled from 'styled-components'

const Login = styled.div`
text-align:center;
h1{
  font-size: 5rem;
}
form{
  >div{
    display:inline-flex;
    justify-content: center;
    label{
      width: 100px;
      font-size: 1.2rem;
    }
    input{
      width: 200px;
      font-size: 1.2rem;
      border:none;
      outline: none;
      border-bottom: 1px solid #333;
    }
    button{
      border: none;
      font-size: 1.5rem;
      width:200px;
      height:3rem;
      color: #fff;
      background-color: #384d98;
      margin-top: 30px;
    }
  }
}
`

export default function Index({ csrfToken }) {
  return (
    <Layout isAuth={false}>
      <Login>
        <h1>SESlack</h1>
        <form method='post' action='/api/auth/callback/credentials'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
          <div>
            <label>Username</label>
            <input name='username' type='text' />
          </div>
          <div>
            <label>Password</label>
            <input name='password' type='password' />
          </div>
          <br/>
          <div>
            <button type='submit'>Sign in</button>
          </div>
        </form>
      </Login>
    </Layout>
  )
}
Index.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context)
  }
}