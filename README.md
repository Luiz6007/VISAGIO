
# ProvAI — Visagismo com IA

Aplicação web de visagismo que ajuda profissionais a gerenciar clientes, agendamentos e análises faciais. O projeto possui front-end em React/TanStack e API REST em Flask, sem dependência do Supabase.

## Funcionalidades do projeto

### Acesso e conta

- Criar conta com nome, e-mail, telefone e tipo de usuário.
- Entrar com e-mail e senha.
- Encerrar sessão.
- Consultar a sessão do usuário autenticado.
- Persistir usuários e senhas protegidas no banco SQLite.

### Clientes

- Cadastrar cliente.
- Listar clientes.
- Pesquisar clientes pelo nome.
- Atualizar dados do cliente.
- Excluir cliente.
- Registrar a data da última visita.

### Agenda

- Criar agendamento.
- Listar agendamentos.
- Filtrar agendamentos por data.
- Confirmar agendamento.
- Marcar agendamento como pendente.
- Excluir agendamento.

### Visagismo e IA

- Enviar foto para análise facial.
- Gerar análise usando Gemini.
- Retornar o formato do rosto.
- Calcular o índice de simetria.
- Recomendar cortes de cabelo.
- Recomendar sobrancelhas.
- Recomendar maquiagem.
- Associar a análise a um cliente.
- Salvar a análise no banco.
- Listar análises por cliente.
- Gerar relatório com o total de análises.

## Arquitetura

O front-end está em `src/` e mantém a interface original do projeto.

O backend Flask está em `backend/`, separado em:

- `controllers/`: recebe as requisições HTTP.
- `services/`: executa os casos de uso e regras de negócio.
- `models/`: representa as entidades e o banco SQLAlchemy.
- `repositories/`: concentra consultas e persistência.
- `services/ai_service.py`: integra a API Gemini.

O diagrama de classes está em [`docs/class-diagram.md`](docs/class-diagram.md).

## Como executar

### Backend

```powershell
py -m pip install -r backend\requirements.txt
py -m backend.run
