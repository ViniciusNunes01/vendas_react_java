import { Produto } from "@/app/models/produtos"
import { useProdutoService } from "@/app/services"
import { converterEmBigDecimal, formatReal } from "@/app/util/money/intex"
import { Input, InputMoney } from "@/components/common"
import { Alert } from "@/components/common/message"
import { Layout } from "@/components/layout"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import * as yup from 'yup'

const msgCampoObrigatorio = "Campo obrigatório";

const validationSchema = yup.object().shape({
    sku: yup.string().trim().required(msgCampoObrigatorio),
    nome: yup.string().trim().required(msgCampoObrigatorio),
    descricao: yup.string().trim().required(msgCampoObrigatorio),
    preco: yup.number().required(msgCampoObrigatorio).moreThan(0, "Valor deve ser maior que 0,00 (Zero)")
})

interface FormErrors {
    sku?: string;
    nome?: string;
    preco?: string;
    descricao?: string;
}

export const CadastroProdutos: React.FC = () => {

    const service = useProdutoService();
    const [sku, setSku] = useState<string>('')
    const [preco, setPreco] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [descricao, setDescricao] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [cadastro, setCadastro] = useState<string>('')
    const [messages, setMessages] = useState<Array<Alert>>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const router = useRouter();
    const { id: queryId } = router.query

    useEffect(() => {

        if (queryId) {
            service.carregarProduto(queryId).then(produtoEncontrado => {
                setId(produtoEncontrado.id)
                setSku(produtoEncontrado.sku || '')
                setNome(produtoEncontrado.nome || '')
                setDescricao(produtoEncontrado.descricao || '')
                setPreco(formatReal(`${produtoEncontrado.preco || 0}`))
                setCadastro(produtoEncontrado.cadastro || '')

                console.log("nome: ", produtoEncontrado.nome)
            })
        }
    }, [queryId])

    const submit = () => {
        const produto: Produto = {
            id,
            sku,
            preco: converterEmBigDecimal(preco),
            nome,
            descricao,
            cadastro
        }

        validationSchema.validate(produto).then(obj => {

            setErrors({})

            if (id) {
                service
                    .atualizar(produto)
                    .then(response => {
                        setMessages([{
                            tipo: "success", texto: "Produto atualizado com sucesso!"
                        }])
                    })

            } else {

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
        }).catch(err => {
            const field = err.path;
            const message = err.message

            setErrors({
                [field]: message
            })
        })
    }

    return (
        <Layout titulo="Produtos" mensagens={messages}>
            <div className="container is-fluid">

                {id &&
                    <div className="columns is-multiline">
                        <Input
                            id="inputId"
                            label="Código: *"
                            columnClasses="column is-6"
                            value={id}
                            disabled={true}
                        />
                        <Input
                            id="inputDataCadastro"
                            label="Data de Cadastro: *"
                            columnClasses="column is-6"
                            value={cadastro}
                            disabled={true}
                        />
                    </div>
                }

                <div className="columns is-multiline">
                    <Input
                        id="inputSku"
                        label="SKU: *"
                        placeholder="Digite o SKU do produto"
                        columnClasses="column is-6"
                        value={sku}
                        onChange={e => setSku(e.target.value)}
                        error={errors.sku}
                    />
                    <InputMoney
                        id="inputPreco"
                        label="Preço: *"
                        placeholder="Digite o PREÇO do produto"
                        columnClasses="column is-6" 
                        value={preco}
                        onChange={e => setPreco(e.target.value)}
                        error={errors.preco}
                    />
                </div>

                <div className="columns">
                    <Input
                        id="inputNome"
                        label="Nome: *"
                        placeholder="Digite o NOME do produto"
                        columnClasses="column is-12"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        error={errors.nome}
                    />
                </div>

                <div className="columns">
                    <div className="column is-12">
                        <div className="field">
                            <label className="label" htmlFor="inputDescricao">Descrição: *</label>
                            <div className="control">
                                <textarea
                                    id="inputDescricao"
                                    className="textarea"
                                    rows={5}
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                    placeholder="Digite a descrição detalhada do produto"
                                />
                                {errors.descricao && <p className="help is-danger">{errors.descricao}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="field is-grouped mt-5">
                    <div className="control">
                        <button onClick={submit} className="button is-success is-fullwidth-mobile">
                            {id ? "Atualizar" : "Salvar"}
                        </button>
                    </div>
                    <div className="control">
                        <Link href="/consultas/produtos">
                            <button className="button is-link is-light is-fullwidth-mobile">Voltar</button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
