import { formatarPreco } from '../utils/formatarPreco'
import { produtoTemPreco } from '../utils/produtos'

export default function SugestaoItem({ produto, onAdicionar }) {
  const semPreco = !produtoTemPreco(produto)

  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <p className="sugestao-titulo">{produto.title}</p>
        <p className="preco preco-pequeno">
          {semPreco ? 'Preço indisponível' : formatarPreco(produto.price)}
        </p>
      </div>
      <button className="botao botao-pequeno" onClick={() => onAdicionar(produto)} disabled={semPreco}>
        {semPreco ? 'Indisponível' : 'Comprar'}
      </button>
    </div>
  )
}
