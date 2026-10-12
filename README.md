# Senator Hotel — mobile app

Guest-facing mobile app for Senator Hotel (Android and iOS). Guests browse rooms, restaurant menus, spa services, events and promotions, and redeem discount coupons. Hotel staff manage all of that content from a separate web admin panel, so nothing needs a new app release to change.

Current version: 1.3.2

## Features

- **Hotel and rooms** — Standard, Deluxe and Suite categories with photo galleries and a fullscreen viewer
- **Two restaurants** (Senator, Gastro Grill Balkon) — menu, photos, events, opening hours, table booking by phone or WhatsApp
- **Spa, conference hall, VIP** — descriptions and photos, spa service list
- **Promotions and events** — visible without an account
- **Coupons** — for signed-in guests; activating a coupon starts a countdown that is stored server-side, so it survives an app restart
- **Phone sign-in** — registration by SMS code, profile stored per user
- **Three languages** — English, Russian, Kazakh, with fallback to English when a translation is missing

## Tech stack

| Area | Technology |
|---|---|
| App | React Native 0.81, Expo SDK 54, TypeScript |
| Navigation | Expo Router (file-based routing) |
| Auth | Firebase Phone Auth (`@react-native-firebase/auth`) |
| Data | Cloud Firestore, Firebase Storage |
| Localization | i18next, react-i18next |
| Builds | EAS Build (development / preview / production profiles) |

## Project structure

```
app/
  _layout.tsx          Root layout: splash, asset preloading, auth and i18n providers
  (tabs)/              One file per screen: home, hotel, restaurants, spa, coupons, profile…
  auth/                Registration, SMS code verification, login
components/            Shared UI: tab bar, back button, auth gate, image viewer header
context/AuthContext    Current user and their Firestore profile
hooks/use-*.ts         One hook per Firestore collection (menu, spa, events, gallery, coupons…)
utils/                 Startup prefetch and in-memory content cache
i18n/locales/          en.json, ru.json, kz.json
firestore.rules        Access rules for the database
storage.rules          Access rules for uploaded images
```

## How content loading works

All editable content lives in Firestore and is written by the admin panel.

1. While the splash screen is shown, the app downloads the menu and spa documents and their images, because those screens are opened first.
2. Everything else (restaurant photos, gallery, events, coupons, promotions) is fetched in the background.
3. Fetched documents are kept in an in-memory cache. Each data hook reads from the cache first and only queries Firestore if the cache is still empty.

## Access rules

- Public content (menu, photos, spa, events, promotions) is readable by anyone.
- Coupons are readable only by signed-in users.
- A user can read and edit only their own profile document.
- Writes to content are allowed only for users with `role == 'admin'`.

## Running locally

The app uses native Firebase modules, so it does not run in Expo Go. A development build is required.

```bash
npm install
eas build --profile development --platform android
npx expo start
```

Firebase settings are read from `EXPO_PUBLIC_FIREBASE_*` environment variables in a local `.env` file.

## Related

The web admin panel (React, Vite, Tailwind) lives in a separate repository and uses the same Firebase project.

## Development approach

The app was built with heavy use of Claude Code. Requirements, review, on-device testing, Firebase configuration and store builds were done by hand; there are no automated tests yet, changes are verified manually on a development build and a preview build before release.
