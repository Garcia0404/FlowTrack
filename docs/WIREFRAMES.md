# FlowTrack — Wireframes (mental model)

## Login

```
┌─────────────────────────────┐
│         [logo]              │
│        FlowTrack            │
│   tagline minimalista       │
│                             │
│   [ email____________ ]     │
│   [ password________ ]      │
│   [ Iniciar sesión   ]      │
└─────────────────────────────┘
```

## Dashboard

```
┌ Header: Logo | Nuevo flujo | User ▾ ─────────────────────┐
│ Tus flujos                                               │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Servicio de Transporte          Activo · 12 may   │  │
│ │ ████████░░ 67%  2/3                    →          │  │
│ └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Detalle de flujo

```
┌ Progreso + título + stats ───────────────────────────────┐
│ [Iniciar flujo] [Export PDF] [Editar]                    │
│                                                          │
│  ●──┌ Paso 1 — Completo ─────────────────────┐          │
│  │  │ Comentario visible…                     │          │
│  ●──┌ Paso 2 — En proceso ⚠ ─────────────────┐          │
│  │  └ checklist 1/2                           │          │
│  ○──┌ Paso 3 — Pendiente ────────────────────┘          │
└──────────────────────────────────────────────────────────┘

Tap paso → Sheet lateral (checklist, comentarios, acciones)
Iniciar flujo → Overlay modal guiado (Siguiente / Completo / Incompleto)
```

## Mobile

- Timeline full-width
- FAB `+` para nuevo flujo
- Sheet ocupa ~100% ancho como drawer
