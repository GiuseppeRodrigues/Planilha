// script.js

// Chaves para LocalStorage
const STORAGE_KEY_ESTOQUE = "dadosEstoque";
const STORAGE_KEY_FINANCAS = "dadosFinancas";

// Alternar entre páginas
document.getElementById("btnEstoque").addEventListener("click", () => {
  document.getElementById("estoque").style.display = "block";
  document.getElementById("financas").style.display = "none";
});

document.getElementById("btnFinancas").addEventListener("click", () => {
  document.getElementById("estoque").style.display = "none";
  document.getElementById("financas").style.display = "block";
});

// Carregar dados do LocalStorage
function carregarDados() {
  const dadosEstoque = JSON.parse(localStorage.getItem(STORAGE_KEY_ESTOQUE)) || [];
  const dadosFinancas = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCAS)) || [];

  // Carregar dados no estoque
  dadosEstoque.forEach((produto) => {
    adicionarLinhaEstoque(produto.nome, produto.quantidade, produto.unidade);
  });

  // Carregar dados financeiros
  dadosFinancas.forEach((registro) => {
    adicionarLinhaFinancas(registro.data, registro.descricao, registro.valor, registro.tipo);
  });

  calcularTotais();
}

// Adicionar produto ao estoque
document.getElementById("btnAddProduto").addEventListener("click", () => {
  adicionarLinhaEstoque("", "", "Kg");
});

function adicionarLinhaEstoque(nome, quantidade, unidade) {
  const tbody = document.getElementById("estoqueBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" value="${nome}" class="nome"></td>
    <td><input type="number" value="${quantidade}" class="quantidade"></td>
    <td>
      <select class="unidade">
        <option value="Kg" ${unidade === "Kg" ? "selected" : ""}>Kg</option>
        <option value="Unidade" ${unidade === "Unidade" ? "selected" : ""}>Unidade</option>
        <option value="L" ${unidade === "L" ? "selected" : ""}>L</option>
      </select>
    </td>
    <td><button class="btnRemove">Remover</button></td>
  `;
  tbody.appendChild(tr);
  addRemoveEvent();
  salvarEstoque();
}

// Salvar estoque no LocalStorage
function salvarEstoque() {
  const dados = [];
  document.querySelectorAll("#estoqueBody tr").forEach((linha) => {
    const nome = linha.querySelector(".nome").value;
    const quantidade = linha.querySelector(".quantidade").value;
    const unidade = linha.querySelector(".unidade").value;
    dados.push({ nome, quantidade, unidade });
  });
  localStorage.setItem(STORAGE_KEY_ESTOQUE, JSON.stringify(dados));
}

// Adicionar registro financeiro
document.getElementById("btnAddFinanceiro").addEventListener("click", () => {
  adicionarLinhaFinancas("", "", "", "entrada");
});

function adicionarLinhaFinancas(data, descricao, valor, tipo) {
  const tbody = document.getElementById("financasBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="date" value="${data}" class="data"></td>
    <td><input type="text" value="${descricao}" class="descricao"></td>
    <td><input type="number" value="${valor}" class="valor"></td>
    <td>
      <select class="tipo">
        <option value="entrada" ${tipo === "entrada" ? "selected" : ""}>Entrada</option>
        <option value="saida" ${tipo === "saida" ? "selected" : ""}>Saída</option>
      </select>
    </td>
  `;
  tbody.appendChild(tr);
  tr.querySelector(".valor").addEventListener("input", () => {
    calcularTotais();
    salvarFinancas();
  });
  tr.querySelector(".tipo").addEventListener("change", () => {
    calcularTotais();
    salvarFinancas();
  });
  calcularTotais();
  salvarFinancas();
}

// Salvar finanças no LocalStorage
function salvarFinancas() {
  const dados = [];
  document.querySelectorAll("#financasBody tr").forEach((linha) => {
    const data = linha.querySelector(".data").value;
    const descricao = linha.querySelector(".descricao").value;
    const valor = linha.querySelector(".valor").value;
    const tipo = linha.querySelector(".tipo").value;
    dados.push({ data, descricao, valor, tipo });
  });
  localStorage.setItem(STORAGE_KEY_FINANCAS, JSON.stringify(dados));
}

// Calcular totais de entradas, saídas e saldo
function calcularTotais() {
  let totalEntradas = 0;
  let totalSaidas = 0;

  document.querySelectorAll("#financasBody tr").forEach((linha) => {
    const valor = parseFloat(linha.querySelector(".valor").value) || 0;
    const tipo = linha.querySelector(".tipo").value;

    if (tipo === "entrada") {
      totalEntradas += valor;
    } else if (tipo === "saida") {
      totalSaidas += valor;
    }
  });

  document.getElementById("totalEntradas").textContent = `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById("totalSaidas").textContent = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById("saldoAtual").textContent = `R$ ${(totalEntradas - totalSaidas).toFixed(2)}`;
}

// Inicializar funções
function addRemoveEvent() {
  document.querySelectorAll(".btnRemove").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.remove();
      salvarEstoque();
      salvarFinancas();
      calcularTotais();
    })
  );
}

// Carregar dados ao iniciar
carregarDados();
