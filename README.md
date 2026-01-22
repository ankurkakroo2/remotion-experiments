# remotion-experiments

Experimental video projects built with [Remotion](https://www.remotion.dev/) — a React framework for programmatic video creation.

## About

This is a playground for exploring Remotion's capabilities: 3D animations, particle effects, typewriter text effects, and timeline-based video compositions.

## Current Experiment

### Introduction Video (60fps)

A brief personal introduction video featuring:
- **3D camera movements** with smooth easing and perspective shifts
- **Glass morphism** card design with backdrop blur
- **Particle field** with floating depth animations
- **Timeline-style layout** for presenting insights
- **Character-by-character** typewriter effect on key statements

#### Scenes
1. **Title** — Animated name reveal with depth
2. **Who I Am** — Identity statement and core strengths
3. **Current Focus** — Professional highlights
4. **The Shift** — Timeline of insights (Before → During → After)
5. **Building in Public** — Learning experiments
6. **Tech Stack** — Skills grouped by Frontier/Core/Platform
7. **Contact** — Social links and closing

## Getting Started

```bash
# Install dependencies
npm install

# Start the preview server
npm start

# Render the video
npm run render
```

The video will be rendered to `out/introduction.mp4` at 60fps, 1920x1080.

## Tech

- **Remotion** 4.0 — React-based video framework
- **TypeScript** — Type-safe animations
- **Google Fonts** — Outfit (headings) & Geist (body)
- **@remotion/transitions** — Scene transitions
- **@remotion/google-fonts** — Font loading

## License

MIT
