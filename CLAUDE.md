# CLAUDE.md — Frontend (Angular 19)

## Contexto

Tenho experiência com Angular standalone components — o frontend é
minha área forte. Estou usando esse projeto para integrar com um backend
Spring Boot que estou aprendendo.

**Foco aqui: boas práticas Angular 19 moderno, RxJS reativo e integração
limpa com a API Spring Boot.**

> Projeto real: Angular **19.2** (CLI 19.2.19, Node 22.12). Scaffold gerado com
> standalone components, routing e CSS. Build de produção sai em `dist/angular-app`.

---

## Stack

- Angular 19 (standalone components, sem NgModules)
- TypeScript
- HttpClient + RxJS
- Angular Signals (`signal`, `computed`, `effect`)
- TailwindCSS ou Angular Material (definir no início)

---

## URL do backend

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Em produção (Vercel), trocar para a URL do Railway.

---

## Estrutura de pastas

```
src/app/
├── app.config.ts               # Configuração global (provideHttpClient, provideRouter)
├── app.routes.ts               # Rotas da aplicação
│
├── core/
│   └── services/
│       ├── filme.service.ts    # Chamadas para /api/filmes
│       └── favorito.service.ts # Chamadas para /api/favoritos
│
├── shared/
│   └── components/
│       └── filme-card/
│           ├── filme-card.component.ts
│           └── filme-card.component.html
│
└── features/
    ├── busca/
    │   ├── busca.component.ts
    │   └── busca.component.html
    ├── detalhe/
    │   ├── detalhe.component.ts
    │   └── detalhe.component.html
    └── favoritos/
        ├── favoritos.component.ts
        └── favoritos.component.html
```

---

## Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | BuscaComponent | Tela principal com busca |
| `/filme/:id` | DetalheComponent | Detalhes do filme |
| `/favoritos` | FavoritosComponent | Lista de favoritos salvos |

---

## Funcionalidades

### Busca reativa
```typescript
// O campo de busca deve usar debounce para não disparar a cada tecla
searchControl = new FormControl('');

ngOnInit() {
  this.searchControl.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(query => this.filmeService.buscar(query))
  ).subscribe(filmes => this.filmes = filmes);
}
```

### Paginação
- Botões "Anterior" / "Próxima" ou scroll infinito
- Parâmetro `page` enviado para o backend

### Favoritos
- Botão de coração nos cards
- Estado visual diferente se já é favorito
- Persiste no backend (H2)

---

## Regras para o Claude Code

- **Sempre usar standalone components** — sem `NgModule`
- **Usar `inject()`** ao invés de constructor injection
- **Tipar tudo** — criar interfaces para `Filme`, `FilmeDetalhe`, `Favorito`
- **Usar `HttpClient` com RxJS** — explicar os operadores usados
- **Usar Signals** onde fizer sentido (estado local do componente)
- **Tratar loading e erro** — exibir feedback visual ao usuário
- Criar `environment.ts` com a URL da API desde o início
- Configurar `proxy.conf.json` para desenvolvimento local

---

## Interfaces esperadas

```typescript
// Baseadas no retorno do backend Spring Boot

interface Filme {
  id: number;
  titulo: string;
  sinopse: string;
  posterUrl: string;
  dataLancamento: string;
  nota: number;
}

interface FilmeDetalhe extends Filme {
  generos: string[];
  duracao: number;
  elenco: string[];
}

interface Favorito {
  id: number;
  tmdbId: number;
  titulo: string;
  posterUrl: string;
  savedAt: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}
```

---

## Proxy para desenvolvimento local

```json
// proxy.conf.json (evita CORS em dev apontando para localhost:8080)
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Adicionar no `angular.json`:
```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

---

## Como começar

```bash
# Peça ao Claude Code:
claude "Cria o app.config.ts com HttpClient e as rotas configuradas"
claude "Cria o FilmeService com o método de busca usando RxJS"
claude "Cria o BuscaComponent com o campo reativo e debounce"
claude "Cria o FilmeCard como componente compartilhado"
claude "Cria o DetalheComponent consumindo /api/filmes/:id"
claude "Cria o FavoritosComponent com lista dos favoritos salvos"
claude "Configura o proxy.conf.json para desenvolvimento local"
claude "Como faço o deploy na Vercel?"
```

---

## Deploy (Vercel)

- Conecta o repositório GitHub na Vercel
- Build command: `npm run build`
- Output directory: `dist/angular-app/browser`
- Variável de ambiente: `API_URL=https://seu-backend.railway.app/api`
- Criar `vercel.json` para redirecionar rotas SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```