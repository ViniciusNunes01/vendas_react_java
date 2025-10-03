import { httpClient } from "@/app/http"
import { Produto } from "@/app/models/produtos"
import { Loader } from "@/components/common"
import { Layout } from "@/components/layout"
import { AxiosResponse } from "axios"
import Link from "next/link"
import useSWR from "swr"
import { TabelaProdutos } from "./tabela"

export const ListagemProdutos: React.FC = () => {

    const { data: result, error } = useSWR<AxiosResponse<Produto[]>>
        ('/api/produtos', (url: any) => httpClient.get(url))


    const editar = (produto: Produto) => {
        console.log(produto, "EDITAR")
    }

    const deletar = (produto: Produto) => {
        console.log(produto, "DELETAR")
    }

    return (
        <Layout titulo="Produtos">
            <Link href="/cadastros/produtos">
                <button className="button is-warning">Novo</button>
                <br></br>
            </Link>
            <br />
            <Loader show={!result} />
            <TabelaProdutos onEdit={editar} onDelete={deletar} produtos={result?.data || []} />
        </Layout>
    )
}