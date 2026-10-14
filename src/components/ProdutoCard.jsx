import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { produtoTemPreco } from '../utils/produtos'

export default function ProdutoCard({ produto, onAdicionar }) {
  const semPreco = !produtoTemPreco(produto)
  const esgotado = produto.estoque === 0
  const indisponivel = semPreco || esgotado

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
        {produtoTemPreco(produto) && produto.price > 100 && (
          <span className="selo selo-frete">Frete grátis</span>
        )}
        {semPreco && <span className="selo selo-esgotado">Sem preço</span>}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={indisponivel}>
        {semPreco ? 'Indisponível' : 'Adicionar ao carrinho'}
      </button>
    </article>
  )
}
