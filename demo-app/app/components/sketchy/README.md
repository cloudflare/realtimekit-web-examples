# Sketchy Components

A collection of hand-drawn, sketchy-styled UI components with configurable borders and underlines.

## Core Provider

### `sketchyProvider`

The unified HOC (Higher-Order Component) that wraps any component with sketchy styling.

**Parameters:**
- `type`: `"border"` | `"underline"` - The style type (default: `"border"`)
- `color`: string - Stroke color (default: `"#30A46C"`)
- `strokeWidth`: number - Stroke width (default: `2`)
- `roughness`: number - Roughness factor (default: `1.2`)
- `offset`: number - Offset for underline (default: `4`)

**Example:**
```tsx
import { sketchyProvider } from "./components/sketchy/sketchyProvider";

const MyComponent = ({ children }) => <div>{children}</div>;

// Border variant
const SketchyBox = sketchyProvider(MyComponent, {
  type: "border",
  color: "#F6821F",
  strokeWidth: 2,
  roughness: 1.5,
});

// Underline variant
const SketchyText = sketchyProvider(MyComponent, {
  type: "underline",
  color: "#30A46C",
  offset: 4,
});
```

## React Components

### `SketchyBorder`

Direct React component for adding sketchy borders.

```tsx
import { SketchyBorder } from "./components/sketchy";

<SketchyBorder color="#F6821F" strokeWidth={2} roughness={1.5}>
  <div>Your content here</div>
</SketchyBorder>
```

### `SketchyUnderline`

Direct React component for adding sketchy underlines.

```tsx
import { SketchyUnderline } from "./components/sketchy";

<SketchyUnderline color="#30A46C" offset={4}>
  <span>Underlined text</span>
</SketchyUnderline>
```

## Implementation Details

- **Architecture**: Path generation logic is contained in respective component files (`border.tsx`, `underline.tsx`) and imported by `sketchyProvider`
- **SVG Generation**: Uses SVG paths with randomized coordinates for hand-drawn effect
- **Responsive**: Automatically adjusts to content size using ResizeObserver
- **Border Style**: Uses artistic SVG paths adapted from reference dimensions with scaling
- **Underline Style**: Generates simple wavy lines below content
- **Path Generation Functions**: 
  - `generateSketchyBorderPaths(width, height, roughness)` - exported from `border.tsx`
  - `generateSketchyUnderlinePaths(width, height, roughness, offset)` - exported from `underline.tsx`
