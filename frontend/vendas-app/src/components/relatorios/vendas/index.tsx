import { Cliente } from "@/app/models/clientes"
import { Page } from "@/app/models/common/page"
import { useClienteService, useRelatoriosService } from "@/app/services"
import { InputDate } from "@/components/common"
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
    const relatorioService = useRelatoriosService();

    const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
        content: [],
        totalElements: 0,
        first: 0,
        size: 0,
        number: 0
    });

    const handleSubmit = (formData: RelatorioVendasForm) => {
        relatorioService.gerarRelatorioVendas(
            formData.cliente?.id,
            formData.dataInicio,
            formData.dataFim
        ).then(blob => {

            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL)
        }

        )
    }

    const formik = useFormik<RelatorioVendasForm>({
        onSubmit: handleSubmit,
        initialValues: {
            cliente: null,
            dataInicio: '',
            dataFim: ''
        }
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
              
                <div className="p-fluid">
                    <div className="grid">

                        <div className="col-12 field">
                            <label htmlFor="cliente" className="font-bold">Cliente</label>
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

                        <div className="col-6 field">
                            <InputDate
                                id="dataInicio"
                                name="dataInicio"
                                label="Data Início"
                                value={formik.values.dataInicio}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="col-6 field">
                            <InputDate
                                id="dataFim"
                                name="dataFim"
                                label="Data Fim"
                                value={formik.values.dataFim}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <Button
                                label="Gerar Relatório"
                                type="submit"
                                icon="pi pi-file-pdf"
                                className="p-button-primary"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    )
}
