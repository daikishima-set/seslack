import '../styles/globals.scss'
import { Provider } from 'next-auth/client'

export default function App({ Component, pageProps }) {
  return (
    <Provider options={{ site: process.env.NEXT_PUBLIC_APP_URL }} session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}