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
        initialValues: formScheme
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

        // Cria uma cópia do array atual de itens
        const itensAdicionados = [...(formik.values.itens || [])];

        const indexEncontrado = itensAdicionados.findIndex((itemVenda: ItemVenda) => {
            return itemVenda.produto.id === produto?.id;
        });

        if (indexEncontrado !== -1) {

            // Se o item já existe, atualiza a quantidade
            const itemExistente = itensAdicionados[indexEncontrado];
            itensAdicionados[indexEncontrado] = {
                ...itemExistente,
                quantidade: itemExistente.quantidade + quantidadeProduto
            };
        } else {

            // Se o item não existe, adiciona um novo item ao array
            if (produto && quantidadeProduto) {
                itensAdicionados.push({
                    produto: produto,
                    quantidade: quantidadeProduto
                });
            }
        }

        // Atualiza os itens
        formik.setFieldValue('itens', itensAdicionados);

        // Recalcula o total
        const novoTotal = totalVenda(itensAdicionados);
        formik.setFieldValue('total', novoTotal);

        // Limpeza
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
                    />
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
                        <DataTable value={formik.values.itens} emptyMessage="Nenhum produto adicionado.">
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
                    </div>

                    <div className="col-4">
                        <div className="field">
                            <label>Forma de Pagamento: *</label>
                            <Dropdown
                                id="formaPagamento"
                                name="formaPagamento"
                                value={formik.values.formaPagamento}
                                options={formasPagamento}
                                optionLabel="descricao"
                                placeholder="Selecione..."
                                onChange={(e) => (formik.setFieldValue("formaPagamento", e.value))}
                            />
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

