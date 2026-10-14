import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoTemPreco, filtrarProdutosDisponiveis } from './utils/produtos'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState(() => {
    try {
      const salvos = JSON.parse(localStorage.getItem('techstore-lista-espera') ?? '[]')
      return Array.isArray(salvos) ? salvos : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('techstore-lista-espera', JSON.stringify(listaEspera))
  }, [listaEspera])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  const produtosDisponiveis = filtrarProdutosDisponiveis(produtos)

  function adicionarAoCarrinho(produto) {
    if (!produtoTemPreco(produto)) return

    setCarrinho((itensAtuais) => itensAtuais.concat(produto))
  }

  function registrarEspera({ produtoId, nome, email }) {
    const emailNormalizado = String(email).trim().toLowerCase()
    let jaRegistrado = false

    setListaEspera((atual) => {
      jaRegistrado = atual.some(
        (item) => item.produtoId === produtoId && item.email.toLowerCase() === emailNormalizado
      )

      if (jaRegistrado) return atual

      return [
        ...atual,
        {
          id: `${produtoId}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          produtoId,
          nome: String(nome).trim(),
          email: String(email).trim(),
        },
      ]
    })

    return !jaRegistrado
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((itensAtuais) => {
      let removido = false

      return itensAtuais.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    })
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={
                <Loja
                  carrinho={carrinho}
                  produtos={produtosDisponiveis}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  carrinho={carrinho}
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                  listaEspera={listaEspera}
                  onRegistrarEspera={registrarEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtosDisponiveis}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
