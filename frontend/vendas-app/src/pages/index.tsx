import { DashboardData } from '@/app/models/dashboard';
import { useDashboardService } from '@/app/services';
import { Dashboard, Layout, RotaAutenticada } from '@/components';
import Head from 'next/head';
import React from 'react';

interface HomeProps {
  dashboard: DashboardData;
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  return (
    <RotaAutenticada>
      <Head>
        <title>Vendas App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout titulo="Dashboard">
        {props ? (
          <Dashboard
            clientes={props.dashboard.clientes}
            produtos={props.dashboard.produtos}
            vendas={props.dashboard.vendas}
            vendasPorMes={props.dashboard.vendasPorMes}
          />
        ) : (
          <p>Carregando dados...</p>
        )}
      </Layout>
    </RotaAutenticada>
  )
}

export async function getStaticProps() {
  try {
    const service = useDashboardService();
    const dashboard: DashboardData = await service.get();

    return {
      props: {
        dashboard,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return {
      props: {
      },
    };
  }
}

export default Home;