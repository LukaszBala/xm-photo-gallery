# Photo Gallery

An Angular photo gallery application with infinite scroll, photo detail view, and favorites management.

## Requirements

- Node.js 22.22.3+ or 24.15.0+ or 26.0.0+

## Setup

```bash
npm install
```

Husky git hooks are installed automatically as part of `npm install`.

## Development

```bash
npm start
```

The app will be available at **http://localhost:4200**.

| Page         | URL                              |
| ------------ | -------------------------------- |
| Gallery      | http://localhost:4200/photos     |
| Favorites    | http://localhost:4200/favorites  |
| Photo detail | http://localhost:4200/photos/:id |

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Testing

Runs all unit tests once using [Vitest](https://vitest.dev). To watch for changes:

```bash
npm test
```

## Linting

```bash
npm run lint
```

Runs [ESLint](https://eslint.org) across all TypeScript and HTML source files.

## Git hooks

A pre-commit hook runs lint and tests automatically before every commit. The commit is blocked if either fails.
