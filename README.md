# Purple Birthday App 🎉💜

A tiny **Expo (React Native)** app with a **vibrant purple gradient** theme that:

- bursts **confetti from the in-app icon** when the app opens (and when you tap the icon)
- shows the message: **“HAPPY BIRTHDAY BIIIIIIIIIIIIITCH!”**
- plays an audio track (placeholder included) using `expo-av`

> **Note on the home‑screen icon:** iOS/Android do **not** let an app animate its *actual* home‑screen icon.  
> This project shows a matching “icon tile” **inside the app** and launches confetti from it immediately after you tap the app icon to open the app.

---

## Run it (recommended)

This avoids any version mismatch by letting Expo pick compatible dependency versions:

```bash
npx create-expo-app@latest purple-birthday-bitch
cd purple-birthday-bitch

# Install deps with Expo's version matching:
npx expo install expo-av expo-linear-gradient expo-haptics
npm i react-native-confetti-cannon

# Copy these files into your project:
# App.tsx
# src/**
# assets/**
# app.json (optional)
```

Then run:

```bash
npx expo start
```

---

## Replacing the audio with the real song

This repo includes a short **placeholder** wav file at:

`assets/birthday-bitch.wav`

For legal/copyright reasons, it does **not** ship the actual track.

To use the real song:
1. Make sure you have the rights to use the audio file.
2. Replace `assets/birthday-bitch.wav` with your file (you can keep the same filename), **or** change the `require(...)` path in:
   - `src/screens/HomeScreen.tsx`

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

---

## License

MIT — do whatever you want, but don’t include copyrighted music unless you own the rights.
