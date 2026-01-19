# Icon Component

A dynamic icon component that renders SVGs from `icons.json` based on the prop value you pass.

## Usage

```tsx
import { Icon } from './icons';

// Basic usage
<Icon name="code" />

// With custom size
<Icon name="code" size={32} />

// With custom className
<Icon name="github" className="hover:text-blue-500" />

// With custom color
<Icon name="docs" color="#FF5733" />

// All props combined
<Icon 
  name="code" 
  size={48} 
  className="mx-2" 
  color="#75FFDE" 
/>
```

## Props

- **name** (required): The icon name from `icons.json` (e.g., "code", "docs", "github")
- **size** (optional): Width and height of the icon (default: 24)
- **className** (optional): Additional CSS classes
- **color** (optional): SVG fill color (default: "currentColor")

## Available Icons

- **code** - Code brackets/symbols icon
- **docs** - Documentation/file icon  
- **github** - GitHub logo icon

To add more icons, edit `icons.json` with SVG strings.
