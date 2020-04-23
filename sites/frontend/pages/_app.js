import App, { createUrl, Container } from 'next/app'
import uuidv4 from 'uuid/v4'
import Layout from '../components/Layout'
import http , { setHeaderToken } from "../lib/http"

import { PageTransition } from 'next-page-transitions'

import { Provider } from 'mobx-react'
// import initializeStore from '../stores/initializeStore'
import '../static/styles.css';


export default class MyApp extends App {
  state = {
  }

  constructor(props) {
    super(props)
    const isServer = typeof window === 'undefined'
    // this.mobxStore = isServer ? props.initialMobxState : initializeStore(props.initialMobxState)
  }

  static async getInitialProps ({ Component, ctx }) {
    // const mobxStore = initializeStore()
    try {
      // ctx.mobxStore = mobxStore

      let pageProps = {}
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
      }

      // return { pageProps, initialMobxState: mobxStore }
      return { pageProps }
    } catch (error) {

      // Capture errors that happen during a page's getInitialProps.
      // This will work on both client and server sides.
      const errorEventId = captureException(error, ctx)
      return {
        hasError: true,
        errorEventId,
        pageProps: error.pageProps,
        // initialMobxState: mobxStore
      }
    }
  }


  render () {
    const { router, Component, pageProps } = this.props
    let statusCode = 200
    if (pageProps && pageProps.statusCode) {
      statusCode = pageProps.statusCode
    }
    const url = createUrl(router)
    return (
      <Provider {...this.mobxStore}>
        <Container>
          <Layout statusCode={statusCode} >
            <PageTransition
              timeout={300}
              classNames='page fade'
            >
              <Component {...pageProps} key={url.pathname}/>
            </PageTransition>
          </Layout>
        </Container>
      </Provider>
    )
  }
}

// export default function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }