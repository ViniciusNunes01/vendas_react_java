import { Cliente } from "@/app/models/clientes"
import { Page } from "@/app/models/common/page"
import { Venda } from "@/app/models/vendas"
import { useClienteService } from "@/app/services"
import { useFormik } from "formik"
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useState } from "react"

interface VendasFormProps {
    onSubmit: (venda: Venda) => void
}

const formScheme: Venda = {
    cliente: {},
    produtos: [],
    total: 0,
    formaPagamento: ''
}

export const VendasForm: React.FC<VendasFormProps> = ({
    onSubmit
}) => {

    const clienteService = useClienteService();
    const [codigoProduto, setCodigoProduto] = useState<string>('');
    const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
        content: [],
        totalElements: 0,
        first: 0,
        size: 0,
        number: 0
    })

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

    const handleClienteChange = (e: AutoCompleteChangeEvent) => {

        const clienteSelecionado: Cliente = e.value;
        formik.setFieldValue('cliente', clienteSelecionado);
    }

    const handleCodigoProdutoSelect = (e: any) => {
        console.log(codigoProduto)
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
                        <AutoComplete />
                    </div>


                    <div className="field col-12 md:col-2">
                        <span className="p-float-label">
                            <InputText
                                id="qtdProduto"
                            />
                            <label htmlFor="qtdProduto">QTD</label>
                        </span>
                    </div>

                    <div className="field col-12 md:col-2">
                        <Button label="Adicionar" />
                    </div>
                </div>
                <Button type="submit" label="Finalizar" className="mt-2" />
            </div>

        </form>
    )
}

