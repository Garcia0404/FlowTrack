# FlowTrack — Architecture

## Overview

FlowTrack is a client-first workflow manager designed for a future backend migration (Supabase, PostgreSQL, REST/tRPC, multi-tenant auth). The codebase follows **ports & adapters** with thin UI, domain services, and swappable persistence.

```
┌─────────────────────────────────────────────────────────────┐
│  App Router (pages, layouts, middleware)                    │
├─────────────────────────────────────────────────────────────┤
│  Components (presentation only)                             │
├─────────────────────────────────────────────────────────────┤
│  Zustand stores (authStore, flowStore, uiStore)             │
├─────────────────────────────────────────────────────────────┤
│  Services (FlowService, AuthService, PdfExportService)      │
├─────────────────────────────────────────────────────────────┤
│  Repositories (IFlowRepository, IAuthRepository)              │
├─────────────────────────────────────────────────────────────┤
│  Adapters (LocalStorageAdapter) → future ApiAdapter         │
└─────────────────────────────────────────────────────────────┘
```

## Layers

| Layer | Responsibility |
|-------|----------------|
| **types** | Domain entities, DTOs, repository contracts |
| **constants** | Status maps, storage keys, auth config |
| **adapters** | Low-level persistence (localStorage today) |
| **repositories** | CRUD + queries per aggregate |
| **services** | Business rules, orchestration, PDF export |
| **stores** | UI state + sync with services (autosave) |
| **components** | Dumb/presentational + small containers |
| **app** | Routing, middleware, API routes for cookies |

## Domain model

- **Flow**: title, description, date, global status, steps[], guided session metadata
- **FlowStep**: title, description, status, checklist[], comments[], observations, simulated files, timestamps
- **AuthSession**: hardcoded local user (replaceable with Supabase session)

## Migration path

1. Implement `ApiFlowRepository` implementing `IFlowRepository`
2. Wire `getFlowRepository()` factory to env `NEXT_PUBLIC_DATA_SOURCE=api`
3. Replace cookie auth with Supabase Auth + middleware session refresh
4. Move autosave debounce to optimistic API patches

## Auth (current → future)

- **Now**: Zustand `authStore` + `localStorage` + `flowtrack-auth` cookie for middleware
- **Future**: `SupabaseAuthRepository`, server components with session, RLS on `flows` table

## Persistence keys

- `flowtrack:flows` — all flows
- `flowtrack:auth` — session snapshot
- UI state is in-memory only (panel / guided overlay)
