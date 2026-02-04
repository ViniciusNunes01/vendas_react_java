import { AxiosResponse } from "axios"
import { httpClient } from "../http"
import { DashboardData } from "../models/dashboard"


const resourceURL: string = "/api/dashboard"

export const useDashboardService = () => {
    return {
        get: async (ano?: number): Promise<DashboardData> => {
            const url = ano ? `${resourceURL}?ano=${ano}` : resourceURL;
            const response: AxiosResponse<DashboardData> = await httpClient.get<DashboardData>(url);
            return response.data;
        }
    }
}