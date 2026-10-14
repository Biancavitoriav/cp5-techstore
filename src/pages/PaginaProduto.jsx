import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'
import { filtrarProdutosDisponiveis, produtoTemPreco } from '../utils/produtos'

export default function PaginaProduto({
  carrinho = [],
  produtos,
  onAdicionar,
  onRemover,
  listaEspera = [],
  onRegistrarEspera,
}) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')
  const [sucessoEspera, setSucessoEspera] = useState(false)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado ou indisponível no momento.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const semPreco = !produtoTemPreco(produto)
  const esgotado = produto.estoque === 0
  const quantidadeNoCarrinho = carrinho.filter((item) => item.id === produto.id).length

  const relacionados = filtrarProdutosDisponiveis(produtos)
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  const listaEsperaProduto = listaEspera.filter((item) => item.produtoId === produto.id)

  function handleRegistrarEspera(event) {
    event.preventDefault()

    const nomeFormatado = nome.trim()
    const emailFormatado = email.trim()

    if (!nomeFormatado || !emailFormatado) {
      setSucessoEspera(false)
      setMensagemEspera('Preencha seu nome e e-mail para receber o aviso.')
      return
    }

    const foiAdicionado = onRegistrarEspera({ produtoId: produto.id, nome: nomeFormatado, email: emailFormatado })

    if (!foiAdicionado) {
      setSucessoEspera(false)
      setMensagemEspera('Você já está na lista de espera para este produto.')
      return
    }

    setNome('')
    setEmail('')
    setSucessoEspera(true)
    setMensagemEspera('Você entrou na lista de espera. Vamos avisar por e-mail quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {semPreco ? 'Preço indisponível' : formatarPreco(produto.price)}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {semPreco
              ? 'Produto indisponível no momento'
              : esgotado
                ? 'Produto esgotado'
                : `${produto.estoque} unidades disponíveis`}
          </p>

          <button
            className={`botao botao-grande ${quantidadeNoCarrinho > 0 ? 'botao-ativo' : ''}`}
            onClick={() => onAdicionar(produto)}
            disabled={semPreco || esgotado}
          >
            {semPreco ? 'Indisponível' : esgotado ? 'Esgotado' : quantidadeNoCarrinho > 0 ? 'Adicionar mais' : 'Adicionar ao carrinho'}
          </button>

          {quantidadeNoCarrinho > 0 && (
            <p className="card-quantidade card-quantidade-destaque" aria-live="polite">
              {quantidadeNoCarrinho} unidade{quantidadeNoCarrinho === 1 ? '' : 's'} no carrinho
            </p>
          )}

          {esgotado && (
            <div className="aviso-esgotado">
              <h2>Receber aviso quando voltar</h2>
              <p>
                Deixe seu nome e e-mail para ser avisado assim que este produto estiver disponível
                novamente.
              </p>

              <form className="formulario-espera" onSubmit={handleRegistrarEspera}>
                <label className="campo">
                  <span>Nome</span>
                  <input
                    type="text"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Seu nome"
                  />
                </label>

                <label className="campo">
                  <span>E-mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                  />
                </label>

                <button type="submit" className="botao">
                  Me avisem quando voltar
                </button>
              </form>

              {mensagemEspera && (
                <p className={sucessoEspera ? 'mensagem-sucesso' : 'mensagem-erro'}>
                  {mensagemEspera}
                </p>
              )}

              {listaEsperaProduto.length > 0 && (
                <p className="lista-espera-contador">
                  {listaEsperaProduto.length} pessoa(s) já estão na fila para este produto.
                </p>
              )}
            </div>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
