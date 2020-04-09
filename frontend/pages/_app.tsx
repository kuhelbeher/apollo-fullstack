import { ApolloProvider } from 'react-apollo';
import App, { Container, AppContext, AppProps } from 'next/app';
import { ParsedUrlQuery } from 'querystring';
import { ApolloClient, InMemoryCache } from 'apollo-boost';

import withData from '../lib/withData';
import Page from '../components/Page';

type Props = AppProps & {
  apollo: ApolloClient<InMemoryCache>;
};

class MyApp extends App<Props> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps: { query?: ParsedUrlQuery } = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(MyApp);
