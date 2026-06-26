# Safefy Docs

Documentação oficial da API Safefy Pay, construída com [Mintlify](https://mintlify.com).

## Stack

- **Plataforma:** Mintlify (docs-as-code, MDX-based)
- **Config:** `docs.json` na raiz
- **Linguagens:** pt-BR (primário) + en (secundário)
- **API Reference:** OpenAPI 3.0 em `/api-reference/openapi.json`
- **Publish:** Auto-deploy via GitHub App da Mintlify (push na `main`)

## Estrutura

```
/
├── docs.json              # Config principal (navegação, tema, API)
├── *.mdx                  # Docs pt-BR (raiz)
├── en/*.mdx               # Docs en
├── api-reference/         # API reference pages + openapi.json
├── ai-tools/              # AI tools/docs
├── essentials/            # Essential guides
├── images/                # Imagens/assets
├── snippets/              # Code snippets
└── logo/                  # Logos (light/dark)
```

## Comandos Úteis

```bash
# Preview local
npm i -g mint
mint dev                    # http://localhost:3000

# Build estático
mint build

# Atualizar CLI
mint update
```

## Regras

1. **MDX, não MD puro** — Mintlify usa MDX com componentes customizados (`.mdx`).
2. **Navegação em `docs.json`** — toda página nova precisa ser registrada no `navigation` do `docs.json`.
3. **Bilíngue (pt-BR + en)** — toda página em pt-BR na raiz tem mirror em `en/`.
4. **OpenAPI como fonte da verdade** — schemas de API são gerados do OpenAPI, não escritos manualmente.
5. **`mint dev` antes do push** — sempre verifique o preview local antes de publicar.
6. **Auto-deploy** — push na `main` publica automaticamente em https://docs.safefypay.com.br (ou domínio configurado).

## Links

- Preview local: `http://localhost:3000`
- Dashboard Mintlify: https://dashboard.mintlify.com
- Documentação Mintlify: https://mintlify.com/docs
