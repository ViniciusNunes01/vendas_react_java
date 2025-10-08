import { Produto } from "@/app/models/produtos"
import { useProdutoService } from "@/app/services"
import { converterEmBigDecimal, formatReal } from "@/app/util/money/intex"
import { Input } from "@/components/common"
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
                    error={errors.sku}
                />
                <Input
                    id="inputPreco"
                    label="Preço: *"
                    placeholder="Digite o PREÇO do produto"
                    columnClasses="is-half"
                    value={preco}
                    onChange={setPreco}
                    currency
                    error={errors.preco}
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
                    error={errors.nome}
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
                            placeholder="Digite a descrição do produto"
                        />
                        {
                            errors.descricao &&
                            <p className="help is-danger">{errors.descricao}</p>
                        }
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
                    <Link href="/consultas/produtos">
                        <button className="button is-link is-light">Voltar</button>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}
