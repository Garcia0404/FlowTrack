# FlowTrack

Aplicación web premium para gestionar flujos de trabajo paso a paso con timeline vertical, modo guiado, comentarios, checklist y exportación PDF.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (auth, flows, UI)
- **Framer Motion**
- **shadcn/ui** + Lucide
- **pdf-lib** (exportación)
- **localStorage** (persistencia desacoplada vía repositories)

## Inicio rápido

```bash
cd ~/Projects/flowtrack
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Credenciales demo

| Campo | Valor |
|-------|-------|
| Email | `admin@flowtrack.app` |
| Contraseña | `flowtrack2024` |

## Arquitectura

```
src/
├── app/              # Rutas App Router + middleware
├── components/       # UI, timeline, flow, auth, layout
├── stores/           # Zustand (auth, flow, ui)
├── services/         # Lógica de negocio
├── repositories/     # LocalFlowRepository, LocalAuthRepository
├── adapters/         # LocalStorageAdapter
├── types/            # Dominio + contratos IRepository
├── constants/        # Estados, storage keys, auth local
├── hooks/            # Flow autosave / dirty state
└── utils/            # IDs, fechas, progreso, cookies
```

Documentación extendida:

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)

## Funcionalidades

- CRUD de flujos y pasos dinámicos
- Timeline vertical con estados (pendiente, en proceso, completo, incompleto)
- Panel lateral / sheet con checklist, comentarios y observaciones
- Modo guiado «Iniciar flujo» con avance automático
- Autosave en localStorage + toasts
- Export PDF estilo reporte limpio
- Auth local + middleware + cookie
- Light mode premium (always enforced)
- Responsive (drawer en móvil)

## Migración futura

Reemplazar `LocalFlowRepository` por `ApiFlowRepository` en `src/lib/repository-factory.ts` y conectar Supabase Auth sin cambiar componentes ni stores.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Servidor producción |
| `npm run lint` | ESLint |
