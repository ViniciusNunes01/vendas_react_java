import { AxiosResponse } from "axios"
import { httpClient } from "../http"

const resourceURL = `/api/vendas/relatorio-vendas`;

export const useRelatoriosService = () => {

    const gerarRelatorioVendas = async (
        idCliente: string | undefined = '',
        dataInicio: string = '',
        dataFim: string = ''
    ): Promise<Blob> => {

        const response: AxiosResponse<Blob> = await httpClient.get(resourceURL, {
            params: {
                id: idCliente,
                inicio: dataInicio,
                fim: dataFim
            },
            responseType: 'blob'
        })

        const bytes = response.data

        return new Blob([bytes], { type: 'application/pdf' })
    }

    return {
        gerarRelatorioVendas
    }
}