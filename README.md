# ProvAI

Aplicação de visagismo com front-end TanStack/React e API Flask.

## Funcionalidades Implementadas

1. Verificar saúde da API
2. Listar clientes
3. Cadastrar cliente
4. Atualizar cliente
5. Excluir cliente
6. Pesquisar clientes por nome
7. Listar agendamentos
8. Filtrar agendamentos por data
9. Criar agendamento
10. Confirmar agendamento
11. Marcar agendamento como pendente
12. Excluir agendamento
13. Listar análises de visagismo
14. Filtrar análises por cliente
15. Criar análise de visagismo
16. Excluir análise
17. Gerar relatório de total de análises
18. Autenticar usuário
19. Cadastrar perfil
20. Atualizar perfil
21. Cadastrar estabelecimento
22. Atualizar senha

## Arquitetura

O backend está em `backend/`, separado em `controllers/`, `services/`, `models/` e `repositories/`. O diagrama de classes está em [`docs/class-diagram.md`](docs/class-diagram.md). A API usa SQLite por padrão e aceita `DATABASE_URL` para outro banco.

## Execução

```bash
python -m venv .venv
.venv/Scripts/pip install -r backend/requirements.txt
python -m backend.run
```

O front-end permanece com o mesmo visual. Para publicar o banco Supabase usado pela autenticação, consulte `BACKEND.md`.
