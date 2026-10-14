import { formatarPreco, normalizarPreco } from './formatarPreco'

// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export const VALOR_MINIMO_FRETE_GRATIS = 200

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const preco = normalizarPreco(produto?.price ?? produto?.preco)
    return total + preco
  }, 0)
}

export function temFreteGratis(carrinho) {
  return calcularTotal(carrinho) >= VALOR_MINIMO_FRETE_GRATIS
}

export function calcularRestanteParaFreteGratis(carrinho) {
  const total = calcularTotal(carrinho)
  return Math.max(0, VALOR_MINIMO_FRETE_GRATIS - total)
}

export function obterMensagemFreteGratis(carrinho) {
  if (temFreteGratis(carrinho)) {
    return 'Você ganhou frete grátis!'
  }

  const restante = calcularRestanteParaFreteGratis(carrinho)
  return `Falta ${formatarPreco(restante)} para ganhar frete grátis.`
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
