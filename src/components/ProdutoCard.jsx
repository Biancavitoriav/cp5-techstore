import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { produtoTemPreco } from '../utils/produtos'

export default function ProdutoCard({ produto, onAdicionar, onRemover, quantidadeNoCarrinho = 0 }) {
  const semPreco = !produtoTemPreco(produto)
  const esgotado = produto.estoque === 0
  const indisponivel = semPreco || esgotado
  const freteGratisNoProduto = produtoTemPreco(produto) && Number(produto.price) >= 200
  const quantidadeAtual = Number(quantidadeNoCarrinho) || 0
  const jaNoCarrinho = quantidadeAtual > 0

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">
          {semPreco ? 'Preço indisponível' : formatarPreco(produto.price)}
        </span>
      </div>

      <div className="card-selos">
        {freteGratisNoProduto && <span className="selo selo-frete">Frete grátis</span>}
        {semPreco && <span className="selo selo-esgotado">Sem preço</span>}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
        {jaNoCarrinho && !indisponivel && (
          <span className="selo selo-ok" aria-live="polite">
            {quantidadeAtual} no carrinho
          </span>
        )}
      </div>

      <div className="card-acoes">
        <button
          className={`botao ${jaNoCarrinho ? 'botao-ativo' : ''}`}
          onClick={() => onAdicionar(produto)}
          disabled={indisponivel}
          aria-label={
            semPreco ? 'Produto indisponível' : `${jaNoCarrinho ? 'Adicionar mais unidades' : 'Adicionar ao carrinho'} de ${produto.title}`
          }
        >
          {semPreco ? 'Indisponível' : esgotado ? 'Esgotado' : jaNoCarrinho ? 'Adicionar mais' : 'Adicionar ao carrinho'}
        </button>

        {jaNoCarrinho && !indisponivel && (
          <button
            type="button"
            className="botao-remover"
            onClick={() => onRemover?.(produto.id)}
            aria-label={`Remover ${produto.title} do carrinho`}
            title="Remover do carrinho"
          >
            −
          </button>
        )}
      </div>
    </article>
  )
}
