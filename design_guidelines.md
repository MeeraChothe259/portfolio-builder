# Portfolio Builder Design Guidelines

## Design Approach

**Selected System:** Material Design 3 principles with inspiration from Linear and Notion
**Rationale:** This is a productivity tool requiring clarity, efficiency, and familiar patterns. Users need to quickly understand how to build portfolios without friction.

## Core Design Elements

### Typography
- **Primary Font:** Inter (via Google Fonts CDN)
- **Headings:** Font weights 600-700, sizes: text-3xl (dashboard titles), text-2xl (section headers), text-xl (card titles)
- **Body:** Font weight 400-500, sizes: text-base (forms, content), text-sm (labels, metadata)
- **Monospace:** JetBrains Mono for username displays and technical content

### Layout System
**Spacing Units:** Tailwind units of 4, 6, and 8 for consistency
- Component padding: p-6 or p-8
- Section margins: mb-6, mb-8
- Card spacing: gap-6 in grids
- Form field spacing: space-y-4
- Container max-width: max-w-7xl for dashboard, max-w-4xl for forms

### Component Library

**Navigation**
- Top navbar: Fixed header with logo left, navigation center, user menu right
- Height: h-16
- Dashboard sidebar: w-64, collapsible on mobile
- Breadcrumbs for nested navigation

**Authentication Pages (Login/Register)**
- Centered card layout: max-w-md mx-auto
- Minimal design: Logo, form, alternative action link
- Single-column form fields with clear labels above inputs
- Large CTA button: w-full, py-3

**Dashboard**
- Two-column layout: Sidebar (w-64) + Main content (flex-1)
- Stats cards in grid: grid-cols-1 md:grid-cols-3 gap-6
- Action buttons in top-right of sections
- Empty states with illustrations and CTA

**Portfolio Creation/Edit Forms**
- Single-column form layout: max-w-3xl
- Grouped sections with clear headings (text-xl, mb-4)
- Form sections: Bio, Skills (tag input), Projects (repeatable cards), Education (timeline), Experience (timeline)
- Field groups: Label (text-sm, mb-2) + Input/Textarea
- Add/Remove buttons for repeatable sections (Projects, Education, Experience)
- Sticky footer with Save/Cancel buttons

**Public Portfolio View**
- Hero section: Full-width with user name (text-4xl), title (text-xl), and bio
- Content sections in cards: About, Skills (pill badges), Projects (grid-cols-1 md:grid-cols-2), Education/Experience (timeline layout)
- Fixed-width content: max-w-5xl mx-auto
- Share button in top-right corner

**Form Elements**
- Inputs: h-11, rounded-lg, border, px-4
- Textareas: min-h-32, rounded-lg, border, p-4
- Buttons: Primary (py-2.5 px-6, rounded-lg, font-medium), Secondary (outlined)
- Tags/Pills: Rounded-full, px-4, py-1.5, text-sm

**Cards**
- Standard card: rounded-xl, border, p-6
- Project cards: Image thumbnail + title + description + link
- Hover state: Subtle shadow elevation

**Icons**
- Library: Heroicons (via CDN)
- Usage: Sidebar navigation, form actions, social links, edit/delete buttons
- Size: w-5 h-5 for inline, w-6 h-6 for prominent actions

### Responsive Behavior
- Mobile (<768px): Sidebar collapses to hamburger, single-column grids, reduced padding (p-4)
- Tablet (768-1024px): Two-column grids where appropriate
- Desktop (>1024px): Full multi-column layouts, expanded sidebar

### Images
**Dashboard:** No hero image needed; focus on functionality
**Public Portfolio:** 
- Optional profile image (circular, w-32 h-32) in hero section
- Project thumbnails (16:9 aspect ratio, rounded-lg) in project cards
- Placeholder images for empty states

### Accessibility
- Form labels always visible (no placeholder-only inputs)
- Focus states on all interactive elements (ring-2)
- Semantic HTML (main, nav, section, article)
- ARIA labels for icon-only buttons
- Keyboard navigation support throughout

### Unique Elements
- Timeline component for Education/Experience (vertical line with nodes)
- Tag input with autocomplete for Skills section
- Live preview toggle for portfolio editing
- Copy-to-clipboard for portfolio URL
- Drag-to-reorder for projects/sections (visual indicator: cursor-move)