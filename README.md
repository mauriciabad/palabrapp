# PalabrApp

[![Netlify Status](https://api.netlify.com/api/v1/badges/afbb7365-3fa1-4c69-9cbb-486b2b328ab2/deploy-status)](https://app.netlify.com/sites/palabrapp2/deploys)

Small app for education. Spanish language students use it to track their vocabulary.

Use it here: <https://palabrapp.mauri.app>

## Develop

To update the Supabase TypeScript types run:

```zsh
npx supabase login

npx supabase gen types typescript --project-id "tsnycpxyfsftylvafhbp"  --schema public > types/supabase.ts
```

### Services

- Supabase: <https://supabase.com/dashboard/project/tsnycpxyfsftylvafhbp>
- Netlify: <https://app.netlify.com/sites/palabrapp2>
