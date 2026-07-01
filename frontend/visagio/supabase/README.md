# Backend Supabase

Este e o backend do app `visagio`.

## O que ele usa

- Supabase Auth para cadastro e login com e-mail/senha.
- Tabela `profiles` para guardar dados basicos do usuario.
- RLS para cada usuario acessar somente o proprio perfil.
- Trigger para criar o perfil automaticamente quando a conta e criada.

## Como configurar no Supabase

1. Crie um projeto no Supabase.
2. No painel, va em `Authentication` e deixe o login por e-mail ativo.
3. Abra o `SQL Editor`.
4. Rode o arquivo:

```text
supabase/migrations/20260630154500_create_visagio_backend.sql
```

5. Copie a `Project URL` e a `anon public key`.
6. Use essas chaves no app Flutter.

## Usar as chaves no Flutter

O arquivo do app e:

```text
lib/supabase_config.dart
```

Tambem da para passar as chaves no build:

```bash
flutter build apk --release --dart-define=SUPABASE_URL=sua_url --dart-define=SUPABASE_ANON_KEY=sua_chave
```

Para iPhone:

```bash
flutter build ipa --release --dart-define=SUPABASE_URL=sua_url --dart-define=SUPABASE_ANON_KEY=sua_chave
```
