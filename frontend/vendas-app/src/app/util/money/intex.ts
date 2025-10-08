export const converterEmBigDecimal = (value: any): number => {
    if (!value) {
        return 0;
    }
    return value.replace(".","").replace(",", ".")
}

export const formatReal = (valor: any): string => {
  // Remove tudo que não é dígito
  const onlyDigits = valor.replace(/\D/g, '');

  // Converte para número em centavos
  const numberValue = parseFloat(onlyDigits) / 100;

  // Se for NaN, retorna vazio
  if (isNaN(numberValue)) return '';

  // Formata em Real brasileiro
  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
