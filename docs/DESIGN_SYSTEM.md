# FlowTrack — Design System

## Principles

- **Silent UI**: chrome fades; content leads
- **Editorial rhythm**: generous whitespace, tight headlines
- **One action color**: `#0066cc` (Apple blue)
- **Soft semantics**: never saturated status colors

## Color tokens

| Token | Light | Usage |
|-------|-------|-------|
| `--ft-surface` | `#ffffff` | Cards, panels |
| `--ft-canvas` | `#f5f5f7` | Page background |
| `--ft-ink` | `#1d1d1f` | Primary text |
| `--ft-muted` | `#737373` | Secondary text (Gray 500) |
| `--ft-label` | `#404040` | Labels importantes (Gray 700) |
| `--ft-action` | `#0066cc` | Primary CTA, in-progress |
| `--ft-elevated` | `#272729` | Logo blocks, accents |
| `--ft-border` | `#e5e5e5` | Borders (Gray 200) |

### Step status

| Status | Background | Border | Icon |
|--------|------------|--------|------|
| Pendiente | `#f5f5f7` | `#e8e8ed` | neutral |
| En proceso | `#0066cc14` | `#0066cc40` | blue |
| Completo | `#34c7591a` | `#34c75950` | green |
| Incompleto | `#ff95001a` | `#ff950060` | alert amber |

## Typography

- **Font**: Inter (UI), system-ui fallback
- **Display**: `tracking-[-0.02em]`, `font-semibold`
- **Body**: `text-[15px] leading-relaxed`
- **Caption**: `text-[13px] text-muted`

## Components

- **Pills**: `rounded-full px-3 py-1 text-xs font-medium`
- **Cards**: `rounded-2xl border border-black/[0.06] bg-white shadow-none`
- **Buttons**: scale `0.98` on press (Framer Motion)
- **Timeline**: 2px connector, 10px nodes, cards offset 24px

## Motion

- Enter: `opacity 0→1`, `y: 8→0`, duration `0.35`, ease `[0.25, 0.1, 0.25, 1]`
- Stagger children: `0.05s` delay
- Sheet/drawer: spring `stiffness: 380, damping: 36`

## Light mode only

FlowTrack always renders in light mode (`color-scheme: light only`). System or browser dark preferences are ignored.
