import * as Yup from 'yup'

export const validationScheme = Yup.object().shape({

    cliente: Yup.object()
        .typeError('Preencha com um cliente válido.')
        .nullable()
        .required('Campo obrigatório.')
        .test('vazio', 'Preencha com um cliente válido.', (value: any) => {
            return value && (value.id || value.nome);
        }),
    itens: Yup.array().min(1, 'Adicione pelo menos um produto à venda.'),
    formaPagamento: Yup.string().trim().required('Campo obrigatório.'),
})