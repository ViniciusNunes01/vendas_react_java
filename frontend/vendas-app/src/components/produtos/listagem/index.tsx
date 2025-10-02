import { Layout } from "@/components/layout"
import Link from "next/link"
import { TabelaProdutos } from "./tabela"
import { Produto } from "@/app/models/produtos"
import useSWR from 'swr'

export const ListagemProdutos: React.FC = () => {

    const produtos: Produto[] = []
    //const { data } = useSWR()

    return (

        <Layout titulo="Produtos">
            <Link href="/cadastros/produtos">
                <button className="button is-warning">Novo</button>
            </Link>
            <br />
            <TabelaProdutos produtos={produtos} />
        </Layout>

    )
}