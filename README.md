
# Desafio Backend Teddy

API REST desenvolvida em Node.js com a funcionalidade principal de encurtamento de URL.

## Tecnologias

- Node.js v20.16.0 LTS (VERSAO UTILIZADA E RECOMENDADA)
- Sequelize ORM
- MySQL
- Express
- TypeScript


## Instalação

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd desafio-backend-teddy

2. Instale as dependências:

   ```bash
   npm install

3. Configure o arquivo .env:

   Crie um arquivo .env na raiz do projeto com base no arquivo de exemplo fornecido (.env.example). Copie o conteúdo do .env.example para um novo arquivo .env e substitua os valores de exemplo pelas suas configurações reais:

    ```bash
    cp .env.example .env

4. Inicie o servidor:

   ```bash
   npm run dev

## Documentação

- A documentação da API, gerada com Swagger, está disponível na rota [http://localhost:{PORT}](http://localhost:{PORT}), onde `{PORT}` é a porta definida no arquivo `.env`. Exemplo: [http://localhost:3000/](http://localhost:3000/) ou [http://localhost:3000/api/api-docs](http://localhost:3000/api/api-docs) para visualizar a documentação localmente.
- A documentação também está disponível no ambiente de produção: [https://desafio-backend.up.railway.app/api/api-docs](https://desafio-backend.up.railway.app/api/api-docs).

### Notas:

- Substitua `<URL_DO_REPOSITÓRIO>` pela URL real do seu repositório Git.
- Substitua `{PORT}` pela porta real definida no arquivo `.env`.
- Certifique-se de que todos os comandos e detalhes estejam corretos e ajustados conforme sua configuração específica.
- Certifique-se sobre a versao do node utilizada.
- Certifique-se de que as configurações MySQL esteja correta.
- Link do ambiente de producao: (https://desafio-backend.up.railway.app/)
- Se você estiver usando o Yarn, substitua `npm` por `yarn` nos comandos acima.


