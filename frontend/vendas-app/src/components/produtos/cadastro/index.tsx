import { Produto } from "@/app/models/produtos"
import { useProdutoService } from "@/app/services"
import { Input } from "@/components/common"
import { Layout } from "@/components/layout"
import { useState } from "react"


export const CadastroProdutos: React.FC = () => {

    const service = useProdutoService();
    const [sku, setSku] = useState<string>('')
    const [preco, setPreco] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [descricao, setDescricao] = useState<string>('')

    const submit = () => {
        const produto: Produto = {
            sku,
            preco: parseFloat(preco),
            nome,
            descricao
        }
        service
            .salvar(produto)
            .then(produtoResposta => console.log(produtoResposta))
    }


    return (
        <Layout titulo="Produtos">

            <div className="columns">
                <Input
                    id="inputSku"
                    label="SKU: *"
                    placeholder="Digite o SKU do produto"
                    columnClasses="is-half"
                    value={sku}
                    onChange={setSku}
                />
                <Input
                    id="inputPreco"
                    label="Preço: *"
                    placeholder="Digite o PREÇO do produto"
                    columnClasses="is-half"
                    value={preco}
                    onChange={setPreco}
                />
            </div>
            <div className="columns">
                <Input
                    id="inputNome"
                    label="Nome: *"
                    placeholder="Digite o NOME do produto"
                    columnClasses="is-full"
                    value={nome}
                    onChange={setNome}
                />
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
