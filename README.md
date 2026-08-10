# Shadawi — Next.js port

This is the React/Next.js conversion of your static HTML site, set up so it can scale into a big app.

---

## 1. Getting it running

```bash
npm install
npm run dev
```

Then open http://localhost:3000

**Before it works**, copy your assets into the right spots:
- Frame images → `public/images/frames/` (named `0001.png`, `0002.png`, ...)
- Social SVGs → `public/images/` (`x-logo.svg`, `instagram-logo.svg`, etc.)
- Fonts → `public/fonts/` (your three `ApexMk2-*.otf` files)

> 🧠 Anything inside `public/` is served at the root URL. So `public/fonts/ApexMk2-Regular.otf` is reachable at `/fonts/ApexMk2-Regular.otf`. This is why the paths in `globals.css` start with `/fonts/` not `./fonts/`.

---

## 2. Read the files in this order

Each file has heavy teaching comments. Read them in this order and React will click:

1. **`src/app/layout.jsx`** — the root layout (what wraps every page)
2. **`src/app/page.jsx`** — the home page (just composition, very short)
3. **`src/sections/Ownership/Ownership.jsx`** — simplest possible component, no interactivity
4. **`src/components/Button/Button.jsx`** — your first reusable component with props
5. **`src/components/ReserveForm/ReserveForm.jsx`** — `useState`, controlled inputs, event handlers
6. **`src/hooks/useScrollFrames.js`** — `useEffect`, `useRef`, cleanup, custom hooks
7. **`src/components/FrameCanvas/FrameCanvas.jsx`** — how a custom hook gets used

---

## 3. The folder structure

```
shadawi-next/
├── public/                       # static assets served at root URL
│   ├── images/
│   │   └── frames/               # your scroll-synced PNG sequence
│   └── fonts/                    # Apex font files
│
├── src/
│   ├── app/                      # 🧠 Next.js App Router lives here
│   │   ├── layout.jsx            # wraps every page (one <html>, one <body>)
│   │   ├── page.jsx              # the route "/"
│   │   ├── page.module.css       # styles for the home page only
│   │   └── gallery/
│   │       └── page.jsx          # the route "/gallery"
│   │
│   ├── components/               # 🧠 reusable building blocks
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   ├── FrameCanvas/
│   │   │   ├── FrameCanvas.jsx
│   │   │   └── FrameCanvas.module.css
│   │   └── ReserveForm/
│   │       ├── ReserveForm.jsx
│   │       └── ReserveForm.module.css
│   │
│   ├── sections/                 # 🧠 large page chunks (one per "screen")
│   │   ├── sections.module.css   # shared styles for all sections
│   │   ├── Hero/
│   │   ├── Ownership/
│   │   ├── Stories/
│   │   └── Connect/
│   │
│   ├── hooks/                    # 🧠 reusable logic (custom hooks)
│   │   └── useScrollFrames.js
│   │
│   └── styles/
│       └── globals.css           # fonts + CSS variables + body reset
│
├── next.config.mjs
├── jsconfig.json                 # enables @/ path aliases
└── package.json
```

### Why this structure?

- **`components/`** is for things used in many places (buttons, inputs, modals).
- **`sections/`** is for big page-region chunks. Each one represents roughly one screenful of content.
- **`app/`** holds pages and route-specific code. Pages should be SHORT and just compose sections.
- **`hooks/`** holds logic extracted from components so it can be reused or tested separately.

As the app grows, you'll add:
- `lib/` — utility functions, API wrappers
- `context/` — global state (React Context)
- `types/` — if you ever switch to TypeScript

---

## 4. React concepts cheat sheet

| Old way (vanilla JS) | New way (React) |
|---|---|
| `document.getElementById("email")` | `useState` + controlled inputs |
| `element.textContent = "..."` | Update state, JSX re-renders |
| `element.addEventListener("click", ...)` | `onClick={handler}` on JSX |
| `window.addEventListener("scroll", ...)` | `useEffect` with cleanup |
| `class="button"` | `className={styles.button}` |
| `<a href="/gallery">` for internal | `<Link href="/gallery">` |
| One big `home.js` file | Many small components + hooks |

---

## 5. Things I intentionally improved over your original

- **Scroll listener** now uses `requestAnimationFrame` throttling. No more 60+ updates/sec.
- **Cleanup** on unmount — listeners get removed when navigating away.
- **`<Link>`** for internal navigation instead of `window.location.href` — no full page reload.
- **`<form onSubmit>`** instead of attaching listeners after the fact — the React way.
- **`SOCIAL_LINKS` array** in `Connect.jsx` — adding a new social is a one-line change.
- **No more `getElementById`** anywhere — state-driven UI throughout.

---

## 6. What to build next

You said you'd build sub-sections one at a time. When you're ready:
1. Drop the gallery page contents into `src/app/gallery/page.jsx`
2. Make new sub-components in `src/components/` or new sections in `src/sections/`
3. Add new routes by creating `src/app/<route-name>/page.jsx`

Ping me with the next section and we'll keep going.
