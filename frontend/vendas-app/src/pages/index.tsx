import { Dashboard, Layout } from '@/components';
import Head from 'next/head'

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Vendas App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout titulo='Dashboard'>
        <Dashboard clientes={150} produtos={85} vendas={320} />
      </Layout>
    </div>
  )
}

export default Home;
