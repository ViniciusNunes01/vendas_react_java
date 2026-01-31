import { Cliente } from "@/app/models/clientes"
import { Page } from "@/app/models/common/page"
import { Produto } from "@/app/models/produtos"
import { ItemVenda, Venda } from "@/app/models/vendas"
import { useClienteService, useProdutoService } from "@/app/services"
import { formatarMoeda } from "@/app/util/money/intex"
import { useFormik } from "formik"
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { useState } from "react"
import { validationScheme } from "./validationScheme"

interface VendasFormProps {
    onSubmit: (venda: Venda) => void
}

const formScheme: Venda = {
    cliente: {},
    itens: [],
    total: 0,
    formaPagamento: ''
}

export const VendasForm: React.FC<VendasFormProps> = ({
    onSubmit
}) => {

    const formasPagamento: String[] = ["DINHEIRO", "CARTÃO"]
    const clienteService = useClienteService();
    const produtoService = useProdutoService();
    const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
    const [listaFiltradaProdutos, setListaFiltradaProdutos] = useState<Produto[]>([]);
    const [mensagem, setMensagem] = useState<string>('');
    const [codigoProduto, setCodigoProduto] = useState<string>('');
    const [quantidadeProduto, setQuantidadeProduto] = useState<number>(0);
    const [produto, setProduto] = useState<Produto | null>(null);
    const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
        content: [],
        totalElements: 0,
        first: 0,
        size: 0,
        number: 0
    });

    const formik = useFormik<Venda>({
        onSubmit,
        initialValues: formScheme,
        validationSchema: validationScheme
    })

    const handleClienteAutoComplete = (e: AutoCompleteCompleteEvent) => {

        const nome = e.query
        clienteService
            .find(nome, '', 0, 10)
            .then(clientes => setListaClientes(clientes))
    }

    const handleProdutoAutoComplete = async (e: AutoCompleteCompleteEvent) => {

        if (!listaProdutos.length) {
            console.log('Carregando produtos...')
            const produtosEncontrados = await produtoService
                .listar();
            setListaProdutos(produtosEncontrados)
        }

        const produtosEncontrados = listaProdutos
            .filter((produto: Produto) => {

                return produto.nome?.toUpperCase().includes(e.query.toUpperCase())
            })

        setListaFiltradaProdutos(produtosEncontrados)
    }

    const handleClienteChange = (e: AutoCompleteChangeEvent) => {

        const clienteSelecionado: Cliente = e.value;
        formik.setFieldValue('cliente', clienteSelecionado);
    }

    const handleCodigoProdutoSelect = (e: any) => {

        if (codigoProduto) {

            produtoService.carregarProduto(codigoProduto)
                .then(produtoEncontrado => setProduto(produtoEncontrado))
                .catch(error => {
                    setMensagem('Produto não encontrado!')
                })
        }
    }

    const handleAddProduto = () => {

        const itensAtuais = formik.values.itens || [];

        let novaLista = [...itensAtuais];

        const indexEncontrado = novaLista.findIndex((itemVenda: ItemVenda) => {
            return itemVenda.produto.id === produto?.id;
        });

        if (indexEncontrado !== -1) {

            const itemExistente = novaLista[indexEncontrado];
            novaLista[indexEncontrado] = {
                ...itemExistente,
                quantidade: itemExistente.quantidade + quantidadeProduto
            };
        } else {

            if (produto && quantidadeProduto) {
                novaLista.push({
                    produto: produto,
                    quantidade: quantidadeProduto
                });
            }
        }

        formik.setFieldValue('itens', novaLista);

        const novoTotal = totalVenda(novaLista);
        formik.setFieldValue('total', novoTotal);

        formik.setFieldTouched('itens', false);

        setProduto(null);
        setCodigoProduto('');
        setQuantidadeProduto(0);
    }

    const handleFecharDialogProdutoNaoEncontrado = () => {

        setMensagem('')
        setCodigoProduto('')
        setProduto(null)
    }

    const dialogMensagemFooter = () => {

        return (
            <div>
                <Button
                    label="Ok"
                    onClick={handleFecharDialogProdutoNaoEncontrado}
                />
            </div>
        )
    }

    const disableAddProdutoButton = () => {

        return !produto || !quantidadeProduto
    }

    const totalVenda = (itens: ItemVenda[]) => {
        const total = itens.reduce((acc, item) => {
            return acc + (item.quantidade * (item.produto.preco ?? 0));
        }, 0);

        return Number(total.toFixed(2));
    }

    return (

        <form onSubmit={formik.handleSubmit}>

            <div className="p-fluid ">
                <div className="p-field mb-2">
                    <label htmlFor="cliente">Cliente: *</label>
                    <AutoComplete
                        id="cliente"
                        name="cliente"
                        value={formik.values.cliente}
                        suggestions={listaClientes.content}
                        completeMethod={handleClienteAutoComplete}
                        field="nome"
                        onChange={handleClienteChange}
                        className={formik.touched.cliente && formik.errors.cliente ? 'p-invalid' : ''}
                        onBlur={() => formik.setFieldTouched('cliente', true)}
                    />
                    {formik.touched.cliente && formik.errors.cliente && (
                        <small className="p-error" style={{ display: 'block' }}>{formik.errors.cliente as string}</small>
                    )}
                </div>


                <div className="formgrid grid row-gap-3">

                    <div className="field col-12 md:col-2">
                        <span className="p-float-label">
                            <InputText
                                id="codigoProduto"
                                value={codigoProduto}
                                onChange={(e) => setCodigoProduto(e.target.value)}
                                onBlur={handleCodigoProdutoSelect}
                            />
                            <label htmlFor="codigoProduto">Código</label>
                        </span>
                    </div>


                    <div className="field col-12 md:col-6">
                        <AutoComplete
                            id="produto"
                            name="produto"
                            value={produto}
                            field="nome"
                            suggestions={listaFiltradaProdutos}
                            completeMethod={handleProdutoAutoComplete}
                            onChange={(e) => {
                                setProduto(e.value);

                                if (e.value && typeof e.value === 'object') {
                                    setCodigoProduto(e.value.id?.toString() || '');
                                }
                            }}
                        />
                    </div>


                    <div className="field col-12 md:col-2">
                        <span className="p-float-label">
                            <InputText
                                id="qtdProduto"
                                value={quantidadeProduto.toString()}
                                onChange={e => setQuantidadeProduto(parseInt(e.target.value))}
                            />
                            <label htmlFor="qtdProduto">QTD</label>
                        </span>
                    </div>

                    <div className="field col-12 md:col-2">
                        <Button
                            label="Adicionar"
                            onClick={handleAddProduto}
                            type="button"
                            disabled={disableAddProdutoButton()}
                        />
                    </div>

                    <div className="col-12">
                        <DataTable value={formik.values.itens ?? []} key={(formik.values.itens ?? []).length} emptyMessage="Nenhum produto adicionado." dataKey="produto.id">
                            <Column
                                body={(item: ItemVenda, options) => {

                                    const handleRemoverItem = () => {

                                        console.log("ANTES:", formik.values.itens);
                                        console.log("ROW INDEX:", options.rowIndex);
                                        console.log("ITEM CLICADO:", item);

                                        const novaLista = [...(formik.values.itens || [])];
                                        novaLista.splice(options.rowIndex, 1);

                                        console.log("DEPOIS:", novaLista);

                                        formik.setFieldValue("itens", novaLista);

                                        const novoTotal = totalVenda(novaLista);
                                        formik.setFieldValue("total", novoTotal);
                                    }

                                    return (
                                        <Button
                                            type="button"
                                            label="Excluir"
                                            onClick={handleRemoverItem}
                                        />
                                    )
                                }}
                            />


                            <Column field="produto.id" header="Código" />
                            <Column field="produto.sku" header="SKU" />
                            <Column field="produto.nome" header="Produto" />
                            <Column
                                header="Preço (UND)"
                                body={(itemVenda: ItemVenda) => formatarMoeda(itemVenda.produto.preco ?? 0)}
                            />
                            <Column field="quantidade" header="QTD" />
                            <Column
                                header="Total"
                                body={(itemVenda: ItemVenda) => formatarMoeda((itemVenda.produto.preco ?? 0) * itemVenda.quantidade)}
                            />
                        </DataTable>
                        {formik.touched.itens && formik.errors.itens && (
                            <small className="p-error" style={{ marginTop: '5px', display: 'block' }}>
                                {formik.errors.itens as string}
                            </small>
                        )}
                    </div>

                    <div className="col-4">
                        <div className="field">
                            <label>Forma de Pagamento: *</label>
                            <Dropdown
                                id="formaPagamento"
                                name="formaPagamento"
                                value={formik.values.formaPagamento}
                                options={formasPagamento}
                                placeholder="Selecione..."
                                onChange={(e) => formik.setFieldValue("formaPagamento", e.value)}
                                // p-invalid deixa a borda vermelha do PrimeReact
                                className={formik.touched.formaPagamento && formik.errors.formaPagamento ? 'p-invalid' : ''}
                            />
                            {formik.touched.formaPagamento && formik.errors.formaPagamento && (
                                <small className="p-error">{formik.errors.formaPagamento}</small>
                            )}
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="field">
                            <label htmlFor="itens">Itens:</label>
                            <InputText
                                disabled
                                value={formik.values.itens?.length.toString() || '0'}
                            />
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="field">
                            <label htmlFor="total">Total Geral:</label>
                            <InputText
                                disabled
                                value={formatarMoeda(formik.values.total)}
                            />
                        </div>
                    </div>

                </div>
                <Button
                    type="submit"
                    label="Finalizar"
                    className="mt-2"
                />
            </div>
            <Dialog
                header="Atenção!"
                position="top"
                visible={!!mensagem}
                onHide={handleFecharDialogProdutoNaoEncontrado}
                footer={dialogMensagemFooter()}
            >
                {mensagem}
            </Dialog>
        </form>
    )
}

