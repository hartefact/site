# Hero Section Hydration Fix

## Problem

On the first full page load, the Hero section (logo image, tagline, and CTA) was invisible. Navigating to Gallery and then back to Home made everything appear correctly.

## Root Cause

Every visible element in `HeroSection` was wrapped in a Framer Motion component with `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}`. This pattern relies on Framer Motion detecting a fresh component mount to trigger the entrance animation.

On a **full page load**, Next.js server-renders the HTML with the `initial` styles (`opacity: 0`), then React **hydrates** the existing DOM on the client. Hydration reconciles against existing markup rather than creating new elements — Framer Motion can miss this as a "new mount" and never fire the `initial → animate` transition. The elements stay stuck at `opacity: 0`.

On **client-side navigation** (e.g. Gallery → Home), React tears down and freshly mounts the component. Framer Motion correctly detects the mount and the animation plays as expected.

## Fix

Added a `mounted` state that flips to `true` inside a `useEffect`, which only runs after hydration completes on the client. The `animate` prop returns `undefined` until `mounted` is `true`:

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

const show = (values: Record<string, number>) =>
  mounted ? values : undefined;

// Usage
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={show({ opacity: 1, y: 0 })}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

This avoids relying on Framer Motion's mount detection during hydration. Instead, the `useEffect` fires after hydration, the state change triggers a re-render, and Framer Motion sees `animate` change from `undefined` to the target values — an explicit prop change that reliably triggers the animation.

## File Changed

- `components/hero/HeroSection.tsx`
