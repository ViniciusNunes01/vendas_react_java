import { Cliente } from "@/app/models/clientes";
import { Page } from "@/app/models/common/page";
import { useClienteService } from "@/app/services";
import { Input, InputCPF } from "@/components/common";
import { Layout } from "@/components/layout";
import { useFormik } from "formik";
import Router from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { useState } from "react";

interface ConsultaClientesForm {
    nome?: string;
    cpf?: string;
}

export const ListagemClientes: React.FC = () => {

    const service = useClienteService();
    const [loading, setLoading] = useState<boolean>(false);
    const [clientes, setClientes] = useState<Page<Cliente>>({
        content: [],
        size: 10,
        totalElements: 0,
        number: 0,
        first: 0
    });

    const handleSubmit = () => {
        handlePage({
            first: 0,
            rows: clientes.size,
            page: 0
        } as DataTablePageEvent);
    };

    const { handleSubmit: formikSubmit, values: filtro, handleChange } = useFormik<ConsultaClientesForm>({
        onSubmit: handleSubmit,
        initialValues: {
            nome: '',
            cpf: ''
        }
    })

    const handlePage = (e: DataTablePageEvent) => {
        setLoading(true)
        service.find(filtro.nome, filtro.cpf, e?.page, e?.rows)
            .then(result => {
                setClientes({ ...result, first: e?.first });
            }).finally(() => setLoading(false));
    }

    const deletar = (cliente: Cliente) => {
        service.deletarCliente(cliente.id).then(result => {
            handlePage({
                first: 0,
                rows: clientes.size,
                page: 0
            } as DataTablePageEvent)
        })
    }

    const actionTemplate = (registro: Cliente) => {

        const url = `/cadastros/clientes?id=${registro.id}`;

        return (
            <div>
                <Button
                    label="Editar"
                    className="p-button-rounded p-button-info"
                    onClick={e => Router.push(url)}
                />
                <Button
                    label="Deletar"
                    className="p-button-rounded p-button-danger"
                    onClick={(e) => {
                        confirmDialog({
                            message: 'Confirma a exclusão deste registro?',
                            acceptLabel: 'Sim',
                            rejectLabel: 'Não',
                            accept: () => deletar(registro),
                            header: 'Confirmação',
                        });
                    }}
                />
            </div>
        )
    }

    return (

        <Layout titulo="Clientes">
            <form onSubmit={formikSubmit}>

                <div className="columns">
                    <Input
                        id="nome"
                        label="Nome"
                        name="nome"
                        columnClasses="is-half"
                        value={filtro.nome}
                        onChange={handleChange} />
                    <InputCPF
                        id="cpf"
                        label="CPF"
                        name="cpf"
                        columnClasses="is-half"
                        value={filtro.cpf}
                        onChange={handleChange} />
                </div>

                <div className="field is-grouped">
                    <div className="control is-link">
                        <button
                            type="submit"
                            className="button is-success">
                            Consultar
                        </button>
                    </div>
                    <div className="control is-link">
                        <button
                            type="submit"
                            className="button is-warning"
                            onClick={e => Router.push("/cadastros/clientes")}>
                            Novo
                        </button>
                    </div>
                </div>
            </form>

            <br />

            <div className="columns">
                <div className="column is-full">
                    <DataTable
                        value={clientes.content}
                        totalRecords={clientes.totalElements}
                        lazy={true}
                        paginator={true}
                        rows={clientes.size}
                        first={clientes.first}
                        onPage={handlePage}
                        loading={loading}
                        className="w-full"
                        emptyMessage="Nenhum cliente encontrado."
                    >
                        <Column field="id" header="Código" />
                        <Column field="nome" header="Nome" />
                        <Column field="cpf" header="CPF" />
                        <Column field="email" header="Email" />
                        <Column body={actionTemplate} />
                    </DataTable>
                </div>
            </div>
            <ConfirmDialog />
        </Layout>
    );
}   