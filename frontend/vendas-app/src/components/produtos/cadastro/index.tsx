import { Layout } from "@/components/layout"
import { useState } from "react"


export const CadastroProdutos: React.FC = () => {

    const [sku, setSku] = useState('')
    const [preco, setPreco] = useState('')
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')

    const submit = () => {
        const produto = {
            sku: sku,
            preco: preco,
            nome: nome,
            descricao: descricao
        }
        console.log(produto)
    }


    return (
        <Layout titulo="Produtos">

            <div className="columns">
                <div className="field is-half column">
                    <label className="label" htmlFor="inputSku">SKU: *</label>
                    <div className="control">
                        <input
                            id="inputSku"
                            className="input"
                            value={sku}
                            onChange={e => setSku(e.target.value)}
                            placeholder="Digite o SKU do produto" />
                    </div>
                </div>
                <div className="field is-half column">
                    <label className="label" htmlFor="inputPreco">Preço: *</label>
                    <div className="control">
                        <input
                            id="inputPreco"
                            className="input"
                            value={preco}
                            onChange={e => setPreco(e.target.value)}
                            placeholder="Digite o preço do produto" />
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="field column is-full">
                    <label className="label" htmlFor="inputNome">Nome: *</label>
                    <div className="control">
                        <input
                            id="inputNome"
                            className="input"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder="Digite o nome do produto" />
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="field column is-full">
                    <label className="label" htmlFor="inputDescricao">Descrição: *</label>
                    <div className="control">
                        <textarea
                            id="inputDescricao"
                            className="textarea"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            placeholder="Digite a descrição do produto" />
                    </div>
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button onClick={submit} className="button is-link">Salvar</button>
                </div>
                <div className="control">
                    <button className="button is-link is-light">Voltar</button>
                </div>
            </div>
        </Layout>
    )
}
