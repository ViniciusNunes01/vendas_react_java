import { Cliente } from "@/app/models/clientes"
import { useClienteService } from "@/app/services"
import { Alert } from "@/components/common/message"
import { Layout } from "@/components/layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ClienteForm } from "./form"

export const CadastroCliente: React.FC = () => {

    const [cliente, setCliente] = useState<Cliente>({})
    const service = useClienteService();
    const [messages, setMessages] = useState<Array<Alert>>([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            service.carregarCliente(id) 
                .then(clienteEncontrado => setCliente(clienteEncontrado));
        }
    }, [id]);

    const handleSubmit = (cliente: Cliente) => {

        if (cliente.id) {
            service.atualizar(cliente)
                .then(response => {
                    setMessages([{
                        tipo: 'success',
                        texto: 'Cliente atualizado com sucesso!'
                    }])
                })
        } else {
            service.salvar(cliente)
                .then(clienteSalvo => {
                    setCliente(clienteSalvo);
                    setMessages([{
                        tipo: 'success',
                        texto: 'Cliente salvo com sucesso!'
                    }])
                })
        }
    }

    return (
        <Layout titulo="Clientes" mensagens={messages}>
            <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
        </Layout>
    )
}