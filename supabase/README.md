# Configuração do Supabase para o Orça+

Para configurar o banco de dados do Orça+:

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. Vá em **SQL Editor** > **New Query**.
3. Copie e execute o conteúdo de `migrations/001_schema_and_rls.sql`.
4. Copie e execute o conteúdo de `migrations/002_triggers_and_defaults.sql`.
5. Em **Project Settings** > **API**, copie a **Project URL** e a chave **anon public**.
6. Cole esses valores no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
7. Em **Authentication** > **Providers** > **Email**, certifique-se de que "Enable Email provider" está ativado. Se preferir não precisar confirmar o e-mail durante testes locais, desmarque a opção "Confirm email".
