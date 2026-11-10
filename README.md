# GWA Calculator

A single-page **General Weighted Average (GWA) Calculator** built with React. Enter how many subjects you're taking, fill in each subject's details, and get your GWA instantly, with smooth animations and a light/dark theme toggle.

## Features

- **Step-by-step flow**: enter your number of subjects, fill in the generated form, then view your result
- **Dynamic form**: one row per subject with three fields: Course Name, Units, and Grade
- **Instant computation**: shows your GWA with a breakdown of total units and total weighted points
- **Dark mode toggle**: switch themes with a smooth transition
- **Fluid animations**: step transitions, staggered row entrances, hover/focus effects, and an animated GWA count-up
- **Input validation**: inline error messages for empty or invalid fields
- **Responsive**: the 3-column layout collapses gracefully on small screens
- **Reset button**: start over at any time

## Formula

```
GWA = Σ(Grade × Units) ÷ Σ(Units)
```

## Design

The interface follows the 60-30-10 color rule:

| Role | Color | Hex |
|------|-------|-----|
| 60% Dominant | Gunmetal Night | `#1F262D` |
| 30% Secondary | Fog Silver | `#C9CED3` |
| 10% Accent | Molten Orange | `#FF5A1F` |

## Tech Stack

- React (functional components and hooks)
- CSS (custom properties for theming)
