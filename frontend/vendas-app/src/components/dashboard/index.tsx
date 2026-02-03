import { Card } from "primereact/card";

interface DashboardProps {
    clientes?: number;
    produtos?: number;
    vendas?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
    clientes,
    produtos,
    vendas
}) => {

    const produtoCardStyle = {
        background: "red",
        color: "white"
    }

    const clienteCardStyle = {
        background: "blue",
        color: "white"
    }

    const vendaCardStyle = {
        background: "green",
        color: "white"
    }

    return (
        <div className="fluid">
            <div className="grid">
                <div className="col">
                    <Card
                        title="Produtos"
                        style={produtoCardStyle}
                    >
                        <p className="m-0">
                            {produtos}
                        </p>
                    </Card>
                </div>
                <div className="col">
                    <Card
                        title="Clientes"
                        style={clienteCardStyle}
                    >
                        <p className="m-0">
                            {clientes}
                        </p>
                    </Card></div>
                <div className="col">
                    <Card
                        title="Vendas"
                        style={vendaCardStyle}
                    >
                        <p className="m-0">
                            {vendas}
                        </p>
                    </Card> </div>
            </div>
        </div>

    )
}