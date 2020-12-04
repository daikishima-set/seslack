import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import query from 'utils/Query'
import Utils from 'utils/Utils'

type typeUser = {
  id: number,
  name: string,
  email: string
}

const options = {
  site: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        let sql: string = `select * from m_user where name = ? and password = ?`;
        let result: typeUser[] = await query(sql, [credentials.username, Utils.getHash(credentials.password, 'sha512')]);
        if (result) {
          const user: typeUser = { 
            id: result[0].id, 
            name: result[0].name, 
            email: result[0].email, 
          }
          return Promise.resolve(user)
        } else {
          return Promise.resolve(null)
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  }
};
export default (req, res) => NextAuth(req, res, options);
