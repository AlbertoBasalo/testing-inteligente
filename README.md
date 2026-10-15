# Testing Inteligente

Pruebas e2e2 con inteligencia artificial y playwright.

Documentación y demo práctica del curso.

https://github.com/AlbertoBasaloAcademy/testing-inteligente

## Qué incluye

| Proyecto | Carpeta           | Tecnología                                            | Puerto |
| -------- | ----------------- | ----------------------------------------------------- | ------ |
| back     | `projects/back/`  | Node.js, TypeScript, Express 5, SQLite                | 3000   |
| front    | `projects/front/` | TypeScript, Vite, Web Components nativos, Pico CSS    | 4000   |
| e2e      | `e2e/`            | Playwright, TypeScript                                | —      |

## Tests e2e

```bash
# 1. Instalar (una vez)
cd projects/back && npm install && cd ../..
cd projects/front && npm install && cd ../..
cd e2e && npm install && npx playwright install chromium && cd ..

# 2. Arrancar back y front (terminal aparte)
npm start

# 3. Ejecutar los tests
cd e2e
npm test              # headless
npm run test:ui       # modo UI
npm run test:headed   # con navegador visible
npm run report        # abrir el último informe HTML
npm run typecheck     # comprobar tipos
```

- `npm run reset` (en la raíz, con los servidores parados) vacía la base de datos.
- `BASE_URL` cambia la URL del front (por defecto `http://localhost:4000`).
- Los tests están en `e2e/tests/*.spec.ts`; las especificaciones en `specs/*.spec.yaml`.

---

**[Alberto Basalo](https://albertobasalo.dev)**

- [LinkedIn](https://www.linkedin.com/in/albertobasalo/)
- [x/twitter](https://twitter.com/albertobasalo)
- [AI Code Academy](https://aicode.academy)
- [AIDDbot](https://aiddbot.com)
