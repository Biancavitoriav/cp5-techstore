export function normalizarPreco(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  return Number(valor)
}

export function formatarPreco(valor) {
  return normalizarPreco(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
