# TaskFlow – Gerenciador de Tarefas em Microserviços

https://github.com/user-attachments/assets/a5c8eacb-b0b3-4c88-87b5-14853699d6c9

TaskFlow é um sistema de gerenciamento de tarefas com notificações assíncronas, desenvolvido em arquitetura de microserviços.

Ele é composto por:

- Aplicativo mobile (React Native + Expo) para cadastro e consulta das tarefas.
- API Gateway (Spring Boot) que expõe os endpoints REST e publica eventos no RabbitMQ.
- Task Service (Spring Boot) responsável pela persistência das tarefas em PostgreSQL.
- Notification Worker (Spring Boot) que consome mensagens do RabbitMQ e processa notificações em paralelo.
- RabbitMQ como broker de mensagens.
- PostgreSQL como banco de dados relacional.

Toda a infraestrutura de backend é orquestrada via Docker Compose.

---

## 1. Arquitetura (Visão Geral)

Componentes principais:

1. **Mobile App (React Native + Expo)**
   - Cria e lista tarefas.
   - Envia requisições HTTP para o API Gateway.

2. **API Gateway – `api-gateway`**
   - Exposto em `http://localhost:8080/api`.
   - Endpoints:
     - `GET /api/tasks` – lista tarefas.
     - `POST /api/tasks` – cria tarefa.
     - `POST /api/tasks/{id}/complete` – marca tarefa como concluída.
     - `DELETE /api/tasks/{id}` – remove tarefa.
   - Após criar a tarefa, publica um evento `task.created` na exchange do RabbitMQ.

3. **Task Service – `task-service`**
   - Exposto em `http://localhost:8081`.
   - Persistência em PostgreSQL.
   - Endpoints internos (usados pelo gateway):
     - `GET /tasks`
     - `POST /tasks`
     - `POST /tasks/{id}/complete`
     - `DELETE /tasks/{id}`

4. **Notification Worker – `notification-worker`**
   - Não expõe HTTP.
   - Consome mensagens da fila `task.notifications.queue` no RabbitMQ.
   - Processa notificações em paralelo (múltiplos consumidores por instância).
   - Pode ser escalado horizontalmente com múltiplas instâncias Docker.

5. **RabbitMQ**
   - Broker de mensagens.
   - Exchange: `task.notifications.exchange` (Topic).
   - Routing Key: `task.created`.
   - Fila: `task.notifications.queue`.

6. **PostgreSQL**
   - Banco de dados `taskflow`.
   - Tabela `tasks`:
     - `id`, `title`, `description`, `user_id`, `due_date`, `reminder_at`, `completed`.

---

## 2. Pré-requisitos

Para rodar o backend completo:

- Docker e Docker Compose instalados.
- Portas livres:
  - 8080 (API Gateway)
  - 8081 (Task Service)
  - 5432 (PostgreSQL)
  - 5672 e 15672 (RabbitMQ)

Para rodar o app mobile:

- Node.js (versão LTS recomendada).
- npm ou yarn.
- Expo CLI (ou uso via `npx`).

---

## 3. Rodando o backend com Docker Compose

Na pasta raiz, onde está o `docker-compose.yml`:

```bash
# Subir todos os serviços (build + run)
docker compose up --build
```

Isso sobe:

- taskflow-postgres (PostgreSQL)
- taskflow-rabbitmq (RabbitMQ + painel)
- taskflow-task-service (serviço de tarefas)
- taskflow-api-gateway (gateway HTTP)
- taskflow-notification-worker (worker de notificações)

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

Para parar todos:

```bash
docker compose down
```

---

## 4. Testando os endpoints principais

Base do API Gateway (backend que o front deve consumir):

```text
http://localhost:8080/api
```

### 4.1. Criar uma tarefa

```bash
curl -X POST http://localhost:8080/api/tasks   -H "Content-Type: application/json"   -d '{
    "title": "Estudar microserviços",
    "description": "Ler material da disciplina",
    "userId": "user1",
    "dueDate": "2025-11-30T18:00:00",
    "reminderAt": "2025-11-30T17:55:00",
    "completed": false
  }'
```

Resposta esperada: JSON da tarefa criada, incluindo `id`.

### 4.2. Listar tarefas

```bash
curl http://localhost:8080/api/tasks
```

Retorna um array de tarefas.

### 4.3. Concluir uma tarefa

```bash
curl -X POST http://localhost:8080/api/tasks/1/complete
```

Troque `1` pelo `id` da tarefa.  
Resposta: a tarefa com `completed: true`.

### 4.4. Deletar uma tarefa

```bash
curl -X DELETE http://localhost:8080/api/tasks/1
```

Resposta: `204 No Content` em caso de sucesso.

---

## 5. Escalando o Notification Worker (paralelismo)

Para demonstrar paralelismo e distribuição:

1. Com os serviços já rodando, escale o worker:

```bash
docker compose up -d --scale notification-worker=3
```

Isso cria 3 instâncias do `notification-worker` consumindo a mesma fila do RabbitMQ.

2. Dispare várias tarefas (enviando vários `POST /api/tasks` em sequência ou via app).

3. Observe os logs:

```bash
docker ps        # para ver os nomes dos containers
docker logs -f taskflow-notification-worker
# ou, se houver múltiplos containers, use:
docker logs -f <nome_container_worker_1>
docker logs -f <nome_container_worker_2>
```

Você verá diferentes instâncias processando tarefas, demonstrando:

- Paralelismo interno (múltiplos consumidores em uma mesma instância).
- Escalabilidade horizontal (vários containers do worker).

---

## 6. Estrutura dos principais microserviços

### 6.1. API Gateway (`api-gateway`)

- `ApiGatewayApplication.java` – classe principal.
- `application.yml` – porta, URL do task-service e host do RabbitMQ.
- `config/MessagingConfig.java` – define TopicExchange e routing key.
- `config/RabbitConfig.java` – Jackson2JsonMessageConverter para enviar JSON.
- `dto/TaskPayload.java` – DTO usado pelo gateway.
- `service/TaskServiceClient.java` – cliente HTTP para o task-service.
- `service/NotificationPublisher.java` – publica mensagens no RabbitMQ.
- `controller/TaskController.java` – expõe os endpoints `/api/tasks`.

### 6.2. Task Service (`task-service`)

- `TaskServiceApplication.java` – classe principal.
- `application.yml` – datasource PostgreSQL.
- `model/Task.java` – entidade JPA da tabela `tasks`.
- `repository/TaskRepository.java` – interface JPA.
- `controller/TaskController.java` – endpoints `/tasks` (criar, listar, concluir, deletar).

### 6.3. Notification Worker (`notification-worker`)

- `NotificationWorkerApplication.java` – classe principal.
- `application.yml` – configura RabbitMQ.
- `config/MessagingConfig.java` – exchange, fila, binding e container factory com múltiplos consumidores.
- `config/RabbitConfig.java` – Jackson2JsonMessageConverter para consumir JSON.
- `model/TaskMessage.java` – modelo da mensagem recebida.
- `service/NotificationListener.java` – consumidor com `@RabbitListener`.
