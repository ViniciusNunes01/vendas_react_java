export interface DashboardData {
    clientes?: number,
    produtos?: number,
    vendas?: number,
    vendasPorMes?: VendaPorMes[]
}

export interface VendaPorMes {
    mes?: number,
    valor?: number
}