# The markdown manager for mdoc documents

```tree

│   config.ts
│   └───Base config object for the plugin
│
│   index.ts
│   └───exports the key read functions for the plugin, and a component list
│
│   manager.ts
│   └───helper functions to do the underlying work for the readers
│
│   README.md
│
├───components
│   │   Markdoc.astro
│   │   └───renderer for the markdown w/astro
│   │
│   │   Snippet.svelte
│   │   └───renderer for the svelte components
│   │
│   └───custom
│       └───the listed custom components
│
│           Code.astro
│           InlineCode.astro
│
└───plugins
    ├───code-snippets
    │       generate-marker.ts
    │       └───ships a new marker with the default themes for shiki
    │
    │       handle-patterns.ts
    │       └───patter parsing and validation for codeblock functions
    │
    │       index.ts
    │
    ├───headings
    │       generate-toc.ts
    │       └───iterative navigation of the tree to generate a table of contents
    │
    │       handle-level.ts
    │       └───restricts and downgrades the header levels
    │
    │       index.ts
    │
    └───shiki
        └───the shiki themes

            shiki.css.json
            theme.json

```
