# visagio Flutter

Esta e a versao Flutter do aplicativo. O fluxo atual ficou somente com:

- Tela inicial com botao Continuar.
- Tela de Cadastro.
- Tela de Login.

## Arquivos principais

- `lib/main.dart`: telas e navegacao do app.
- `lib/supabase_config.dart`: configuracao do Supabase.
- `pubspec.yaml`: dependencias Flutter.
- `supabase/`: backend do app com SQL e instrucoes do Supabase.

## Backend

O backend esta na pasta:

```text
supabase/
```

Ela contem a migration SQL para criar a tabela `profiles`, as regras de seguranca e o trigger que cria o perfil quando o usuario se cadastra.

## Nome do aplicativo

O projeto foi renomeado para `visagio` no `pubspec.yaml`.

Quando gerar as pastas nativas com Flutter, use:

```powershell
flutter create --project-name visagio --platforms android,ios .
```

Assim o app deixa de aparecer como `bolt`.

## Gerar APK

Em uma maquina com Flutter instalado:

```powershell
flutter create --project-name visagio --platforms android .
flutter pub get
flutter build apk --release
```

O APK fica em:

```text
build/app/outputs/flutter-apk/app-release.apk
```

## Gerar IPA para iPhone

IPA precisa ser gerado em um Mac com Xcode e assinatura Apple:

```bash
flutter create --project-name visagio --platforms ios .
flutter pub get
flutter build ipa --release
```

O codigo Flutter e o mesmo para Android e iPhone, mas o arquivo `.ipa` nao e gerado no Windows.
