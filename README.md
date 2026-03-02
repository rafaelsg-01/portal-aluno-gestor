# 🎓 Portal Institucional (EAD Simulation)

> **Live Demo:** [https://portal-aluno-gestor.projetobot.workers.dev](https://portal-aluno-gestor.projetobot.workers.dev)

Este projeto é uma demonstração completa de um **Portal Institucional** focado em ensino a distância (EAD). O sistema simula um ambiente acadêmico real, segregando as funcionalidades entre **Portal do Aluno** e **Painel do Gestor**, permitindo gestão de conteúdo, consumo de aulas e comunicação em tempo real via WebSockets.

Desenvolvido para demonstrar competências em **Full Stack Development** utilizando ambientes **Serverless** na edge (Cloudflare Workers).

---

## 📸 Visão Geral

### Landing Page
A porta de entrada do sistema, onde o usuário escolhe seu perfil de acesso.
<img width="800" height="auto" alt="image" src="https://github.com/user-attachments/assets/c04e4cc3-bd5b-42d6-8135-c2beaaffc2ed" />

*[Print da rota "/" - Landing Page]*

---

## 🚀 Funcionalidades Principais

### 👨‍🎓 Portal do Aluno
Focado na experiência de aprendizado e consumo de conteúdo.
- **Dashboard Acadêmico**: Visualização centralizada de Atividades, Próximas Provas, Documentos e Vídeo Aulas.
- **Notificações em Tempo Real**: Recebimento instantâneo de comunicados enviados pela gestão (via WebSocket).
- **Consumo de Conteúdo**: Listagem dinâmica de materiais cadastrados pelos professores/gestores.

<img width="800" height="auto" alt="image" src="https://github.com/user-attachments/assets/5ccd335c-36f4-48d6-9200-84fcb89b3b31" />

*[Print da rota "/client" - Dashboard do Aluno]*

### 👨‍💼 Painel do Gestor
Focado em administração e comunicação.
- **Gestão de Conteúdo**: CRUD (Create, Read) para adicionar novas aulas, provas e materiais complementares.
- **Sistema de Broadcast**: Envio de notificações push para todos os alunos conectados simultaneamente.
- **Histórico de Mensagens**: Visualização de todas as comunicações enviadas.

<img width="800" height="auto" alt="image" src="https://github.com/user-attachments/assets/de745cb2-ae58-4eff-ae5d-5ddc9bef8e71" />

*[Print da rota "/admin" - Dashboard do Gestor]*

---

## 🔐 Autenticação e Segurança
O sistema possui fluxos de autenticação independentes para garantir a segurança dos dados.
- **Login/Cadastro Aluno**: Acesso exclusivo para estudantes.
- **Login/Cadastro Gestor**: Acesso administrativo com permissões elevadas.
- **Proteção de Rotas**: Middleware no Worker verifica cookies de sessão antes de permitir acesso às rotas protegidas (`/client` e `/admin`).

| Login Aluno | Login Gestor |
|-------------|--------------|
| <img width="400" height="auto" alt="image" src="https://github.com/user-attachments/assets/8c7ec18a-e421-41a2-a29b-ed1a88580086" /> | <img width="400" height="auto" alt="image" src="https://github.com/user-attachments/assets/09307281-187a-4cb7-a1e6-b5e0a5a873d3" /> |
| *[Print da rota "/login-client"]* | *[Print da rota "/login-admin"]* |

---

## 🛠️ Arquitetura e Tecnologias

Este projeto foi construído utilizando uma arquitetura moderna e escalável baseada na infraestrutura da **Cloudflare**.

- **Cloudflare Workers**: Backend serverless que roda diretamente na Edge, garantindo baixíssima latência. Serve tanto o Frontend (HTML renderizado no server-side) quanto a API.
- **Cloudflare KV (Key-Value Storage)**: Banco de dados NoSQL utilizado para persistir informações de usuários, atividades, aulas e histórico de mensagens. Escolhido pela alta velocidade de leitura na Edge.
- **Durable Objects**: Tecnologia utilizada para manter o estado da conexão **WebSocket**. Isso permite que o servidor mantenha conexões ativas com múltiplos clientes e faça o broadcast de mensagens em tempo real.
- **Frontend**: HTML5, CSS3 Moderno (CSS Variables, Flexbox/Grid) e Vanilla JS. Utiliza design system profissional com **Inter Font**, **FontAwesome** e **Animate.css** para micro-interações.

### Lógica de Funcionamento
1. **Persistência**: Quando um gestor adiciona uma "Nova Prova", o frontend envia um POST para o Worker, que grava o JSON no **KV Storage**.
2. **Leitura**: Quando o aluno acessa o portal, o Worker consulta o KV e renderiza a lista de provas atualizada.
3. **Real-time**: Quando o gestor envia um comunicado, a mensagem vai para o **Durable Object**, que itera sobre todas as conexões WebSocket abertas e entrega a mensagem instantaneamente na tela dos alunos logados.

---

## 💻 Como Rodar Localmente

Para rodar este projeto em sua máquina, você precisará do `Node.js` e do **Wrangler** (CLI da Cloudflare) instalados.

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/portal-institucional.git
   cd portal-institucional
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:8787` em seu navegador.

---

**Desenvolvido por Rafael SG** - *Demonstração de Projeto Full Stack Serverless*
