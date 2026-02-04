import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { VendaPorMes } from "@/app/models/dashboard";

interface DashboardProps {
    clientes?: number;
    produtos?: number;
    vendas?: number;
    vendasPorMes?: VendaPorMes[];
}

export const Dashboard: React.FC<DashboardProps> = (props) => {

    const [dados, setDados] = useState<DashboardProps>(props);
    const [anoSelecionado, setAnoSelecionado] = useState(2026);
    const [carregando, setCarregando] = useState(false);

    const anosOpcoes = [
        { label: '2026', value: 2026 },
        { label: '2025', value: 2025 }
    ];

    useEffect(() => {
        const buscarDadosAno = async () => {
            setCarregando(true);
            try {
                const resposta = await fetch(`http://localhost:8080/api/dashboard?ano=${anoSelecionado}`);
                const novosDados = await resposta.json();

                setDados(novosDados);
            } catch (erro) {
                console.error("Erro ao buscar dados reais:", erro);
            } finally {
                setCarregando(false);
            }
        };

        buscarDadosAno();
    }, [anoSelecionado]);

    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dataAtual = new Date();
    const mesAtualIndice = dataAtual.getMonth();

    const labels = (anoSelecionado === 2026)
        ? mesesNomes.slice(0, mesAtualIndice + 1)
        : mesesNomes;

    const dadosGrafico = labels.map((_, index) => {
        const mesNumero = index + 1;
        const vendaDoMes = dados.vendasPorMes?.find(v => v.mes === mesNumero);

        return vendaDoMes ? vendaDoMes.valor : 0;
    });

    const barData = {
        labels: labels,
        datasets: [{
            label: 'Total de Vendas (R$)',
            backgroundColor: '#42A5F5',
            borderRadius: 5,
            data: dadosGrafico
        }]
    };

    // Dados para o gráfico de Distribuição Geral (Rosca)
    const doughnutData = {
        labels: ['Produtos', 'Clientes', 'Vendas'],
        datasets: [{
            data: [dados.produtos || 0, dados.clientes || 0, dados.vendas || 0],
            backgroundColor: ['#EC4899', '#42A5F5', '#66BB6A'],
            hoverBackgroundColor: ['#D1347F', '#2196F3', '#4CAF50']
        }]
    };

    return (
        <div className="p-4">
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="text-900 font-bold m-0">Visão Geral de Vendas</h2>
                <div className="flex align-items-center">
                    <span className="mr-2 font-medium">Selecionar Ano:</span>
                    <Dropdown
                        value={anoSelecionado}
                        options={anosOpcoes}
                        onChange={(e) => setAnoSelecionado(e.value)}
                        disabled={carregando}
                    />
                </div>
            </div>

            {/* Cards de Indicadores Superiores */}
            <div className="grid mb-4">
                <div className="col-12 md:col-4">
                    <Card className="shadow-2 border-none border-left-3 border-pink-500">
                        <div className="flex align-items-center">
                            <i className="pi pi-box text-pink-500 text-3xl mr-3"></i>
                            <div>
                                <span className="block text-500 font-medium">Produtos</span>
                                <div className="text-900 font-bold text-2xl">{dados.produtos}</div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-4">
                    <Card className="shadow-2 border-none border-left-3 border-blue-500">
                        <div className="flex align-items-center">
                            <i className="pi pi-users text-blue-500 text-3xl mr-3"></i>
                            <div>
                                <span className="block text-500 font-medium">Clientes</span>
                                <div className="text-900 font-bold text-2xl">{dados.clientes}</div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-4">
                    <Card className="shadow-2 border-none border-left-3 border-green-500">
                        <div className="flex align-items-center">
                            <i className="pi pi-shopping-cart text-green-500 text-3xl mr-3"></i>
                            <div>
                                <span className="block text-500 font-medium">Vendas</span>
                                <div className="text-900 font-bold text-2xl">{dados.vendas}</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid">
                {/* Gráfico de Evolução (Barra) */}
                <div className="col-12 md:col-8">
                    <Card title={`Evolução das Vendas - ${anoSelecionado}`} className="shadow-2 h-full">
                        {carregando ? (
                            <div className="flex justify-content-center align-items-center h-20rem">Carregando...</div>
                        ) : (
                            <Chart type="bar" data={barData} options={{ maintainAspectRatio: false, aspectRatio: 0.8 }} height="300px" />
                        )}
                    </Card>
                </div>

                {/* Card de Distribuição Geral (Rosca) */}
                <div className="col-12 md:col-4">
                    <Card title="Distribuição Geral" className="shadow-2 h-full">
                        <div className="flex justify-content-center align-items-center">
                            <div style={{ width: '100%', maxWidth: '250px' }}>
                                <Chart type="doughnut" data={doughnutData} options={{ cutout: '60%', plugins: { legend: { position: 'bottom' } } }} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}