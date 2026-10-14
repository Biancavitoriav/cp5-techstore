export function produtoTemPreco(produto) {
    if (!produto) return false

    const preco = Number(produto.price ?? produto.preco)
    return preco > 0
}

export function produtoDisponivelParaVenda(produto) {
    if (!produto || !produtoTemPreco(produto)) return false

    return Number(produto.estoque ?? 0) > 0
}

export function filtrarProdutosDisponiveis(produtos = []) {
    return produtos.filter((produto) => produtoDisponivelParaVenda(produto))
}
