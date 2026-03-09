const api = "<http://localhost:3000/produtos>";

const form = document.getElementById("formProduto");
const lista = document.getElementById("listaProdutos");

async function carregarProdutos() {
    const response = await fetch(api);
    const produtos = await response.json();

    lista.innerHTML = "";

    produtos.forEach(produto => {
        lista.innerHTML += `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco}</td>
                <td>${produto.categoria}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <button onclick="editar(${produto.id}, '${produto.nome}', '${produto.descricao}', ${produto.preco}, '${produto.categoria}', ${produto.quantidade})">Editar</button>
                    <button onclick="excluir(${produto.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("produtoId").value;
    const produto = {
        nome: nome.value,
        descricao: descricao.value,
        preco: preco.value,
        categoria: categoria.value,
        quantidade: quantidade.value
    };

    if (id) {
        await fetch(`${api}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
    } else {
        await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
    }

    form.reset();
    carregarProdutos();
});

function editar(id, nome, descricao, preco, categoria, quantidade) {
    document.getElementById("produtoId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("descricao").value = descricao;
    document.getElementById("preco").value = preco;
    document.getElementById("categoria").value = categoria;
    document.getElementById("quantidade").value = quantidade;
}

async function excluir(id) {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    carregarProdutos();
}

carregarProdutos();