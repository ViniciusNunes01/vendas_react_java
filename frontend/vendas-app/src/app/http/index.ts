import Axios, {AxiosInstance} from 'axios'

export const httpClient: AxiosInstance = Axios.create({
    
    baseURL: "https://vendas-react-java.onrender.com/"
})
