import { Cliente } from "@/app/models/clientes"
import { Page } from "@/app/models/common/page"
import { useClienteService } from "@/app/services"
import { Layout } from "@/components/layout"
import { useFormik } from "formik"
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete"
import { Button } from "primereact/button"
import { useState } from "react"

interface RelatorioVendasForm {
    cliente: Cliente | null,
    dataInicio: string,
    dataFim: string,
}

export const RelatorioVendas: React.FC = () => {

    const clienteService = useClienteService();
    const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
        content: [],
        totalElements: 0,
        first: 0,
        size: 0,
        number: 0
    });

    const handleSubmit = (formData: RelatorioVendasForm) => {
        console.log(formData)
    }

    const formik = useFormik<RelatorioVendasForm>({
        onSubmit: handleSubmit,
        initialValues: { cliente: null, dataFim: '', dataInicio: '' }
    })

    const handleClienteAutoComplete = (e: AutoCompleteCompleteEvent) => {
        const nome = e.query
        clienteService
            .find(nome, '', 0, 10)
            .then(clientes => setListaClientes(clientes))
    }

    return (
        <Layout titulo="Relatório de Vendas">
            <form onSubmit={formik.handleSubmit}>
                <div className="p-grid">
                    <div className="col-12">
                        <AutoComplete
                            suggestions={listaClientes.content}
                            completeMethod={handleClienteAutoComplete}
                            value={formik.values.cliente}
                            field="nome"
                            id="cliente"
                            name="cliente"
                            onChange={(e: AutoCompleteChangeEvent) => {
                                formik.setFieldValue("cliente", e.value)

                            }}
                        />
                    </div>
                    <div className="co-6">

                    </div>
                    <div className="col-6">

                    </div>
                    <div className="col-6">
                        <Button
                            label="Gerar Relatório"
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </Layout>
    )

}