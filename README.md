# ViSAGIO

Estrutura inicial do projeto ViSAGIO, separada em `frontend` e `backend`.

## Tecnologias

- Frontend: reservado para Flutter
- Backend: Python + Flask
- Banco de dados: MySQL

## Executando o backend

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Linux/macOS:

```bash
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Acesse: `http://127.0.0.1:5000/api/health`
