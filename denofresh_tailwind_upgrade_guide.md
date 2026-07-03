# Deno Fresh & Tailwind CSS Upgrade Guide

This guide details the configuration updates and fixes applied to upgrade the Deno Fresh framework to **v2.3.3** and migrate the styling pipeline to **Tailwind CSS v4**.

---

## 1. Deno Fresh 2.x Configuration Updates

### A. Fluent File-Based Routing (`main.ts`)
In Fresh 2.x, `fsRoutes` is no longer imported and called as a standalone async function. Instead, it is invoked directly on the `App` instance:

```typescript
// Legacy (Fresh 1.x / Alpha 2)
await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

// Modern (Fresh 2.x Stable)
app.fsRoutes();
```

### B. Dev Server Initialization (`dev.ts`)
The `Builder.listen` method expects a function that resolves the `app` instance dynamically rather than receiving the instantiated `app` object directly:

```typescript
// Legacy
await builder.listen(app); // Throws "TypeError: importApp is not a function"

// Modern
await builder.listen(() => Promise.resolve(app));
```

### C. Compiler Options (`deno.json`)
The stable release of Fresh 2.x requires the JSX precompiler to skip all default HTML and document tags. Add the following to your `compilerOptions`:

```json
"compilerOptions": {
  "lib": ["dom", "dom.asynciterable", "dom.iterable", "deno.ns"],
  "jsx": "precompile",
  "jsxImportSource": "preact",
  "jsxPrecompileSkipElements": [
    "a", "img", "source", "body", "html", "head", 
    "title", "meta", "script", "link", "style", 
    "base", "noscript", "template"
  ]
}
```

---

## 2. Tailwind CSS v4 Migration

Tailwind CSS v4 replaces the JavaScript-based `tailwind.config.ts` configuration file with native CSS `@import` rules and `@source` directives.

### A. Dependencies & Node Resolution (`deno.json`)
To enable Tailwind v4, upgrade the `tailwindcss` import to version 4 and configure Deno to automatically manage a `node_modules` directory (required for `@tailwindcss/postcss` package resolution):

```json
{
  "nodeModulesDir": "auto",
  "imports": {
    "fresh": "jsr:@fresh/core@^2.3.3",
    "@fresh/plugin-tailwind": "jsr:@fresh/plugin-tailwind@^1.0.0",
    "tailwindcss": "npm:tailwindcss@^4.0.0"
  }
}
```

### B. Custom Source Configuration (`static/styles.css`)
Tailwind v4 ignores the old `tailwind.config.ts` file. Instead, declare the files to scan using the `@source` directive in your main CSS stylesheet. Use relative paths pointing to your components, routes, and islands directories:

```css
@import "tailwindcss";

/* Sibling directories containing Tailwind classes */
@source "../components/**/*.tsx";
@source "../islands/**/*.tsx";
@source "../routes/**/*.tsx";
@source "./components/**/*.tsx";
@source "./islands/**/*.tsx";
@source "./routes/**/*.tsx";
```

### C. Plugin Registration (`dev.ts`)
Register the Tailwind plugin directly with the builder instance:

```typescript
const builder = new Builder();
tailwind(builder);
```

---

## 3. Troubleshooting & Development Caching

If you make visual changes (such as adding new tailwind classes or editing TSX elements) but do not see them updated in the browser:

1.  **Clear the Production Snapshot Cache**:
    Deno Fresh will always load precompiled code and assets from the `_fresh/` directory if it exists, bypassing the development compilation loop. Run:
    ```bash
    rm -rf frontend/_fresh/
    ```
2.  **Bypass Browser Cache**:
    Perform a hard refresh (`Ctrl + F5` or `Cmd + Shift + R`) to force the browser to request the updated `/styles.css` stylesheet instead of loading it from the local disk cache.
