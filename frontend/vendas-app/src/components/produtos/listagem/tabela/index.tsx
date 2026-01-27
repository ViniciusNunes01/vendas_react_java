import { Produto } from "@/app/models/produtos";
import { Button } from "primereact/button";
import { Column } from 'primereact/column';
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from 'primereact/datatable';

interface TabelaProdutosProps {
    produtos: Array<Produto>
    onEdit: (produto: any) => void;
    onDelete: (produto: any) => void;
}

export const TabelaProdutos: React.FC<TabelaProdutosProps> = ({
    produtos,
    onDelete,
    onEdit
}) => {

    const actionTemplate = (registro: Produto) => {

        const url = `/cadastros/produtos?id=${registro.id}`;

        return (
            <div>
                <Button
                    label="Editar"
                    className="p-button-rounded p-button-info"
                    onClick={e => onEdit(registro)}
                />
                <Button
                    label="Deletar"
                    className="p-button-rounded p-button-danger"
                    onClick={(e) => {
                        confirmDialog({
                            message: 'Confirma a exclusão deste registro?',
                            acceptLabel: 'Sim',
                            rejectLabel: 'Não',
                            accept: () => onDelete(registro),
                            header: 'Confirmação',
                        });
                    }}
                />
            </div>
        )
    }

    return (

        <DataTable
            value={produtos}
            paginator rows={5}
            emptyMessage="Carregando produtos..."
        >
            <Column header="Código" field="id" />
            <Column header="SKU" field="sku" />
            <Column header="Nome" field="nome" />
            <Column header="Preço" field="preco" />
            <Column header="" body={actionTemplate} />
        </DataTable>
    )
}