# Ek-Mobile (Ekmong Mobile)

Mobile application for **Ekmong**, built with **React Native**, **Expo (Development Client)**, and **TypeScript**.

---

## 📱 Tech Stack

- **Framework:** React Native 0.86 + Expo 57 (Custom Development Client)
- **Language:** TypeScript 6
- **Package Manager:** pnpm 12
- **Navigation:** React Navigation 7 (Bottom Tabs + Native Stack)
- **Data Fetching & Cache:** TanStack React Query 5
- **Client State Management:** Zustand 5
- **Networking & Connectivity:** NetInfo + SSE
- **Storage & Security:** Expo SecureStore, Expo SQLite
- **Internationalization:** i18next (English `en` & Khmer `km`)

---

## 📁 Project Structure

The project follows a **Feature-Driven Architecture** with reusable cross-cutting design tokens and components, patterned cleanly after the Flutter foundation:

```
ekmong-mobile/
├── app.config.ts             # Dynamic Expo app configuration & plugins
├── package.json              # Dependencies and npm/pnpm scripts
├── tsconfig.json             # TypeScript path alias (@/* -> src/*)
│
├── src/
│   ├── api/                  # Base HTTP client, API interceptors, error handling
│   │
│   ├── app/                  # Application bootstrap & navigation
│   │   ├── App.tsx           # Root component (SafeAreaProvider, Navigation, DialogHost)
│   │   └── navigation/       # Navigators (BottomTabs, Stacks)
│   │
│   ├── auth/                 # Authentication state, session handling, Apple auth
│   │
│   ├── components/           # Shared reusable components
│   │   ├── ui/               # Core atomic UI primitives (AppText, Card, ProgressBar, TabIcon)
│   │   ├── dialogs/          # Global modal dialogs (ProgressDialog, NoInternetDialog, DialogHost)
│   │   └── bottom-sheets/    # Reusable slide-up bottom sheets (BottomSheet)
│   │
│   ├── config/               # App configuration & environment flavors
│   │   └── flavors.ts        # local, dev, prod configurations & URLs
│   │
│   ├── design/               # Design System & Tokens
│   │   ├── colors.ts         # App color palette (primary, surfaces, accents, status)
│   │   ├── dimen.ts          # Spacing, padding, radius, typography sizes
│   │   ├── appBar.ts         # Header theme options (appBarOptions)
│   │   └── styles.ts         # Pre-configured typography, cards, and shadows
│   │
│   ├── features/             # Feature modules (Business logic & Screens)
│   │   ├── account/          # User profile & account management
│   │   ├── cart/             # Shopping cart & checkout items
│   │   ├── discovery/        # Search & restaurant discovery
│   │   ├── favorites/        # Saved/bookmarked restaurants & items
│   │   ├── home/             # Main home feed & categories
│   │   ├── menu/             # Restaurant food menu & item details
│   │   ├── orders/           # Active orders & order history
│   │   ├── payments/         # Payment integration (KHQR / Bakong / Cards)
│   │   ├── promotions/       # Deals, discounts, and vouchers
│   │   └── qr/               # Table QR code scanner
│   │
│   ├── i18n/                 # Localization (en.json, km.json)
│   ├── lib/                  # Helper utilities, formatters, date tools
│   ├── notifications/        # Push notifications (expo-notifications)
│   ├── realtime/             # Server-Sent Events (SSE) & WebSocket listeners
│   ├── storage/              # SQLite database and key-value secure storage
│   └── telemetry/            # Analytics and crash/error logging
```

---

## 🎨 Design System (`src/design`)

All UI styling references centralized tokens in `src/design`:

- **Colors (`colors.ts`):** 
  - Brand Primary: `#0E5A3A` (Dark Green)
  - Primary Dark: `#0A4229`
  - Primary Light: `#E6F2EC`
  - Accent / Secondary: `#C5E01B` (Lime)
  - Neutral Background: `#F4F5F4`
  - Surface: `#FFFFFF`
- **Dimensions (`dimen.ts`):** Standard white space, elevation, radius, and text sizes.
- **Typography & Shadows (`styles.ts`):** `textStyles`, `cardStyle`, and `shadow`.
- **App Bar Theme (`appBar.ts`):** Shared navigation header style matching the brand.

---

## 🧩 UI Components & Modals

### Atomic UI (`src/components/ui`)
- `<AppText variant="title">`: Text component mapped to design token styles.
- `<Card>`: Container with default radius, surface background, and elevation.
- `<ProgressBar type="dot" | "circle">`: Bouncing three-dot loader or circular spinner.
- `<TabIcon name="home" | "search" | "order" | "account">`: Vector-drawn navigation icons.

### Global Dialogs (`src/components/dialogs`)
Rendered automatically by `<DialogHost />` mounted in `src/app/App.tsx`. Can be called imperatively anywhere without React context:
```ts
import { progressDialog, noInternetDialog } from '@/components/dialogs';

// Show/dismiss progress spinner
progressDialog.show();
await fetchSomeData();
progressDialog.dismiss();

// No Internet dialog automatically displays when offline
noInternetDialog.show();
```

### Bottom Sheets (`src/components/bottom-sheets`)
```tsx
import { BottomSheet } from '@/components/bottom-sheets';

<BottomSheet visible={isOpen} onClose={() => setIsOpen(false)} title="Filter">
  {/* Content */}
</BottomSheet>
```

---

## ⚡ State Management (`Zustand`)

We use **Zustand 5** for all client-side global state (e.g., authentication, shopping cart, user preferences, active table session).

### 🎯 Guidelines & Conventions
1. **Colocate Stores with Features:** Place stores directly in their feature folder (e.g., `src/features/cart/cartStore.ts`, `src/auth/authStore.ts`).
2. **Atomic Selectors:** Always select only the state properties needed to avoid unnecessary re-renders.
3. **Outside React Access:** Zustand stores can be read and updated directly outside of React components (e.g., in API interceptors).

### Example Store Pattern:
```ts
// src/features/cart/cartStore.ts
import { create } from 'zustand';

type CartItem = { id: string; name: string; price: number; quantity: number };

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
```

### Usage in Components:
```tsx
import { useCartStore } from '@/features/cart/cartStore';

export function CartBadge() {
  const itemCount = useCartStore((state) => state.items.length);
  return <AppText>{itemCount} items</AppText>;
}
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20+)
- **pnpm** (installed globally: `npm install -g pnpm`)
- **Android Studio** (for Android Emulator) & **Xcode** (for iOS Simulator on macOS)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Running with Flavors (Metro Bundler)

| Flavor | Command | Description |
|---|---|---|
| **Local** | `pnpm start:local` | Connects to local mock/development servers |
| **Dev** | `pnpm start:dev` | Connects to `dev-api.ekmong.com` |
| **Prod** | `pnpm start:prod` | Connects to production API |

### 4. Running Native Apps

Because this app uses custom native modules and configuration, run it with the custom development client:

- **Android Emulator / Device:**
  ```bash
  pnpm android
  # or: npx expo run:android
  ```

- **iOS Simulator / Device:**
  ```bash
  pnpm ios
  # or: npx expo run:ios
  ```

---

## 🛠 Useful Commands

- **Typecheck:** `pnpm typecheck`
- **Lint:** `pnpm lint`
- **Run Tests:** `pnpm test`
- **Reverse Android Port:** `adb reverse tcp:8081 tcp:8081`
- **Reload JS in Emulator:** Double-tap `R` on Android or press `Cmd+R` on iOS Simulator.
# ek-mobile-test
