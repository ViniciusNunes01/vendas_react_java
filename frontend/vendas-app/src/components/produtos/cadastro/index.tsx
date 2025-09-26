import { Produto } from "@/app/models/produtos"
import { useProdutoService } from "@/app/services"
import { converterEmBigDecimal } from "@/app/util/money/intex"
import { Input, Message } from "@/components/common"
import { Alert } from "@/components/common/message"
import { Layout } from "@/components/layout"
import { useState } from "react"


export const CadastroProdutos: React.FC = () => {

    const service = useProdutoService();
    const [sku, setSku] = useState<string>('')
    const [preco, setPreco] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [descricao, setDescricao] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [cadastro, setCadastro] = useState<string>('')
    const [messages, setMessages] = useState<Array<Alert>>([])

    const submit = () => {
        const produto: Produto = {
            id,
            sku,
            preco: converterEmBigDecimal(preco),
            nome,
            descricao,
            cadastro
        }

        if (id) {
            service
                .atualizar(produto)
                .then(response => {
                    setMessages([{
                        tipo: "success", texto: "Produto atualizado com sucesso!"
                    }])
                })

        } else {

        }

        service
            .salvar(produto)
            .then(produtoResposta => {
                setId(produtoResposta.id)
                setCadastro(produtoResposta.cadastro)
                setMessages([{
                    tipo: "success", texto: "Produto salvo com sucesso!"
                }])
            })
    }


    return (
        <Layout titulo="Produtos" mensagens={messages}>
            {id &&
                <div className="columns">
                    <Input
                        id="inputId"
                        label="Código: *"
                        columnClasses="is-half"
                        value={id}
                        disabled={true}
                    />
                    <Input
                        id="inputDataCadastro"
                        label="Data de Cadastro: *"
                        columnClasses="is-half"
                        value={cadastro}
                        disabled={true}
                    />
                </div>
            }

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
                    currency
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
                    <button onClick={submit} className="button is-link">
                        {id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
                <div className="control">
                    <button className="button is-link is-light">Voltar</button>
                </div>
            </div>
        </Layout>
    )
}
