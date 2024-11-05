# Documentação da API de Transações Bancárias
## Visão Geral
Este sistema de transações bancárias é uma API que gerencia três tipos de transações: depósito, saque e transferência. Projetado para bancos ou serviços financeiros, o sistema processa as operações com alta eficiência e é capaz de lidar com concorrência, garantindo a consistência e integridade dos dados, mesmo em cenários de alta carga.

## Estrutura da Arquitetura
O sistema é dividido em serviços desacoplados que interagem entre si através de APIs e filas de mensagens (RabbitMQ) para garantir a escalabilidade e a confiabilidade. A arquitetura utiliza:
- Node.js para a implementação da API.
- MySQL como banco de dados relacional para persistência das contas e transações.
- RabbitMQ para o processamento de eventos e controle de filas.
- Docker e Docker Compose para orquestração e gerenciamento de contêineres, o que facilita o desenvolvimento e a implantação.

 ## Funcionalidades
 ### Transações Bancárias
 1. #### Depósito
    - Incrementa o saldo da conta especificada com o valor do depósito.
 2. ##### Saque:
    - Diminui o saldo da conta especificada, se houver saldo suficiente.
 3. #### Transferência:
    - Transfere um valor de uma conta de origem para uma conta de destino, realizando a dedução na conta de origem e o incremento na conta de destino, em uma única operação transacional.

### Concorrência e Isolamento de Transações
Para garantir que o sistema possa lidar com concorrência, as seguintes medidas foram implementadas:
- Locks e Controle de Concorrência: Em operações críticas, são aplicados bloqueios para assegurar que duas transações concorrentes não afetem o saldo incorretamente.
- Mensageria: Através do RabbitMQ, as transações são enfileiradas e processadas de forma assíncrona, o que garante que a carga do sistema seja distribuída.

### Tratamento de Falhas
O sistema é projetado para detectar e tratar falhas de forma proativa. Mecanismos de retry em casos de transações, são aplicados em casos de falha temporária pelo rabbitMQ.

## Configuração e Instalação
Para configurar e rodar o sistema, siga os passos abaixo:
1. Clone o repositório do projeto.
   ```bash
     git clone https://github.com/seu-usuario/seu-repositorio.git
   
2. Crie um arquivo .env com as seguintes variáveis:
   ```bash
   # Banco de dados MySQL
   DB_HOST=mysql
   DB_USER=root
   DB_PORT=3306
   DB_PASSWORD=123
   DB_NAME=bank

   # RabbitMQ
   RABBITMQ_HOST=rabbitmq
   RABBITMQ_URL=amqp://bank_trans:123@rabbitmq:5672
   #Server
   PORT=3000

 3. Execute o comando para iniciar os contêineres:
    ```bash
    docker-compose up --build

 4. A aplicação estará disponível na porta 3000.

## API Endpoints
1. **POST /api/account** - Cadastra uma conta bancária com id e saldo.
   ```bash
   POST /api/account
   Content-Type: application/json

   {
    "accountId": "123",
    "balance": 1000.00
   }
   {
    "accountId": "456",
    "balance": 500.00
   }

2. **GET /api/account** - Lista todas as contas bancárias.
      ```bash
      GET /api/account
      Content-Type: application/json
      
3. **POST  /api/transaction** - Realiza uma transação bancária, contendo conta, quantidade, tipo de transação e podendo ter conta de destino caso o tipo seja transferência.
      ```bash
      POST /api/transaction
      Content-Type: application/json

      {
       "accountId": "456",
       "type":"CREDIT",
       "amount": 200,
      }
      {
       "accountId": "123",
       "type":"WITHDRAW",
       "amount": 200,
      }
      {
       "accountId": "123",
       "type":"TRANSFER",
       "amount": 100,
       "targetAccountId:"456"
      }

4. **GET  /api/transaction** - Lista todas as transações.
   ```bash
   GET /api/transactions
   Content-Type: application/json


