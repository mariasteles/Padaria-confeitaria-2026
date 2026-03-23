const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexão com PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'padaria',
    password: 'SUA_SENHA_AQUI',
    port: 5432,
});

// =========================
// ROTAS CRUD
// =========================

// CREATE - Cadastrar produto
app.post('/produtos', async (req, res) => {
    const { nome, descricao, preco, categoria, quantidade } = req.body;

    try {
        const novoProduto = await pool.query(
            'INSERT INTO produtos (nome, descricao, preco, categoria, quantidade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, descricao, preco, categoria, quantidade]
        );
        res.json(novoProduto.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// READ - Listar produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await pool.query('SELECT * FROM produtos ORDER BY id');
        res.json(produtos.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// UPDATE - Atualizar produto
app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, quantidade } = req.body;

    try {
        const produtoAtualizado = await pool.query(
            'UPDATE produtos SET nome=$1, descricao=$2, preco=$3, categoria=$4, quantidade=$5 WHERE id=$6 RETURNING *',
            [nome, descricao, preco, categoria, quantidade, id]
        );
        res.json(produtoAtualizado.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// DELETE - Excluir produto
app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM produtos WHERE id=$1', [id]);
        res.json({ mensagem: "Produto excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em <http://localhost>:${port}`);
});