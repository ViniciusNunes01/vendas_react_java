import { Venda } from "@/app/models/vendas"
import { useVendaService } from "@/app/services"
import { useState } from "react"
import { Alert } from "../common/message"
import { Layout } from "../layout"
import { VendasForm } from "./form"

export const Vendas: React.FC = () => {

    const service = useVendaService();
    const [messages, setMessages] = useState<Alert[]>([])
    const [vendaRealizada, setVendaRealizada] = useState<boolean>(false)

    const handleSubmit = (venda: Venda) => {

        service.realizarVenda(venda).then(response => {

            setMessages([{
                texto: "Venda realizada com sucesso!",
                tipo: "success"
            }])
            setVendaRealizada(true)
        }).catch(error => {

            console.log("erro: ", error)

            setMessages([{
                texto: "Ocorreu um erro, entre em contato com a administração",
                tipo: "danger"
            }])
        })
    }

    const handleNovaVenda = () => {

        setVendaRealizada(false)
        setMessages([])
    }

    return (

        <Layout titulo="Venda" mensagens={messages}>

            <VendasForm
                onSubmit={handleSubmit}
                vendaRealizada={vendaRealizada}
                onNovaVenda={handleNovaVenda}
            />

        </Layout>
    )
}