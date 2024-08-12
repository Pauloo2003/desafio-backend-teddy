
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


    cp .env.example .env


4. Execute as migrations:

   ```bash
   npx sequelize db:migrate

5. Inicie o servidor:

   ```bash
   npm run dev

## Documentação

A documentação da API, gerada com Swagger, está disponível na rota http://localhost:{Porta Definida no Env} Ex: http://localhost:3000/  ou http://localhost:3000/api/api-docs visualizar a documentação localmente.
A documentação tambem está disponivel no ambiente de produção: (https://desafio-backend.up.railway.app/api/api-docs)

### Notas:

- Substitua `<URL_DO_REPOSITÓRIO>` pela URL real do seu repositório Git.
- Certifique-se de que todos os comandos e detalhes estejam corretos e ajustados conforme sua configuração específica.
- Certifique-se sobre a versao do node utilizada.
- Certifique-se de que as configurações MySQL esteja correta.
- Link do ambiente de producao: (https://desafio-backend.up.railway.app/)
- Se você estiver usando o Yarn, substitua `npm` por `yarn` nos comandos acima.


