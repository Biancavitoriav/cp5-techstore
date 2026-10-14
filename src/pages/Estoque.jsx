// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const esperaPorProduto = listaEspera.reduce((acumulador, item) => {
    if (!acumulador[item.produtoId]) {
      acumulador[item.produtoId] = []
    }

    acumulador[item.produtoId].push({ nome: item.nome, email: item.email })
    return acumulador
  }, {})

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Lista de espera</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
                <td>
                  {produto.estoque === 0 ? (
                    <ul className="lista-espera-estoque">
                      {(esperaPorProduto[produto.id] ?? []).length > 0 ? (
                        (esperaPorProduto[produto.id] ?? []).map((cliente, index) => (
                          <li key={`${produto.id}-${cliente.email}-${index}`}>
                            <strong>{cliente.nome}</strong>
                            <span>{cliente.email}</span>
                          </li>
                        ))
                      ) : (
                        <li className="lista-espera-vazia">Nenhuma pessoa na fila</li>
                      )}
                    </ul>
                  ) : (
                    <span className="texto-suave">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
