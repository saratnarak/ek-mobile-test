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
- **Node.js** (v20+ recommended)
- **pnpm** (v12+): Install globally via `npm install -g pnpm`
- **iOS Simulator / Device:** macOS with Xcode 15+, Command Line Tools, and CocoaPods
- **Android Emulator / Device:** Android Studio, Android SDK (API 34+), build-tools, and JDK 17
- **Watchman** (macOS recommended): `brew install watchman`

### 2. Setup & Installation

Follow these steps for a clean clone:

```bash
# 1. Clone repository and navigate to root
git clone <repo-url>
cd Ek-Mobile

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env
```

### 3. Build & Run Custom Development Client

Because this project utilizes custom native plugins and Expo modules, it runs with Expo Development Client builds:

- **iOS Simulator / Device:**
  ```bash
  pnpm ios
  ```

- **Android Emulator / Device:**
  ```bash
  pnpm android
  ```

### 4. Start Metro Development Server

Start Metro connected to your target backend flavor:

```bash
# Connect to local mock / backend (default)
pnpm start:local

# Connect to dev backend (dev-api.ekmong.com)
pnpm start:dev

# Connect to production backend
pnpm start:prod
```

---

## 🌐 Environment Variables & Flavors

Environment variables are loaded via Expo's `EXPO_PUBLIC_*` mechanism from `.env`.

> ⚠️ **Security Warning:** Values prefixed with `EXPO_PUBLIC_*` are bundled directly into the JavaScript client and are readable by anyone decompiling or inspecting the app. **Never place secrets, private signing keys, or server credentials in `.env`.**

### Variables

| Variable | Values | Description |
|---|---|---|
| `EXPO_PUBLIC_BUILD_PROFILE` | `development` \| `preview` \| `production` | Selects app name and bundle ID suffix in `app.config.ts`. Default: `development`. |
| `EXPO_PUBLIC_FLAVOR` | `local` \| `dev` \| `prod` | Selects base API endpoint and configuration in `src/config/flavors.ts`. Default: `local`. |
| `EXPO_PUBLIC_API_BASE_URL` | URL string | Optional override for the flavor's default API URL. |

### Flavors (`src/config/flavors.ts`)

| Flavor | Script | API Base URL | Description |
|---|---|---|---|
| **Local** | `pnpm start:local` | `http://localhost:3000/api/v1/mobile` | Local mock server or BFF instance |
| **Dev** | `pnpm start:dev` | `https://dev-api.ekmong.com/api/v1/mobile` | Shared development & staging environment |
| **Prod** | `pnpm start:prod` | `https://api.ekmong.com/api/v1/mobile` | Production live API |

App bundle identifiers and app names adapt based on build profile in `app.config.ts`:
- **development:** `com.ekmong.app.development` ("Ekmong (development)")
- **preview:** `com.ekmong.app.preview` ("Ekmong (preview)")
- **production:** `com.ekmong.app` ("Ekmong")

---

## 🛠 Project Scripts

| Command | Description |
|---|---|
| `pnpm start` | Start Expo development server with dev client |
| `pnpm start:local` | Start Metro with local flavor and cleared cache |
| `pnpm start:dev` | Start Metro with dev flavor and cleared cache |
| `pnpm start:prod` | Start Metro with production flavor and cleared cache |
| `pnpm ios` | Build and run development client on iOS simulator |
| `pnpm android` | Build and run development client on Android emulator |
| `pnpm lint` | Run ESLint across code and components |
| `pnpm typecheck` | Run TypeScript compiler type checking (`tsc --noEmit`) |
| `pnpm test` | Run Jest unit and component test suites |
| `pnpm i18n:check` | Verify English (`en.json`) and Khmer (`km.json`) key and placeholder parity |
| `pnpm contracts:verify` | Verify vendored contract snapshot files and checksum integrity |
| `pnpm fixtures:check` | Validate mock and test fixture JSON syntax and consistency |
| `pnpm e2e` | Run Maestro mobile end-to-end flows |

---

## 📚 Documentation & Specifications

Engineering specifications, architecture decision records, and product requirements are mirrored locally under `docs/clickup/`:

### Product & Onboarding
- [Product Requirements Document (PRD)](docs/clickup/prd-ekmong-mobile.md)
- [Onboarding Guide](docs/clickup/onboarding.md)
- [Onboarding – Customer Journeys](docs/clickup/onboarding__onboarding-customer-journeys.md)
- [Onboarding – Execution Plan](docs/clickup/onboarding__onboarding-execution-plan.md)
- [Onboarding – Glossary & Domain Terms](docs/clickup/onboarding__onboarding-glossary.md)
- [Onboarding – PRD Summary](docs/clickup/onboarding__onboarding-prd-product-requirements.md)

### Engineering Specs (Implementation 01 – 16)
- [01 Architecture & Technology Foundation](docs/clickup/implementation__implementation-01-architecture.md)
- [02 Design System & Visual Specification](docs/clickup/implementation__implementation-02-design-spec.md)
- [03 API Integration & Network Resilience](docs/clickup/implementation__implementation-03-api-integration.md)
- [04 QR Entry & Dine-In Session Join](docs/clickup/implementation__implementation-04-qr-entry-session-join.md)
- [05 Discovery, Restaurant Menu, Promotions & Cart](docs/clickup/implementation__implementation-05-discovery-menu-promotions-cart.md)
- [06 Checkout, Payment Recovery & Order State](docs/clickup/implementation__implementation-06-checkout-and-recovery.md)
- [07 Payment Integration (KHQR, Bakong & Cards)](docs/clickup/implementation__implementation-07-payments.md)
- [08 Order Tracking, History, Bill & Receipts](docs/clickup/implementation__implementation-08-tracking-history-bill-receipt.md)
- [09 Storage, Security & Privacy Architecture](docs/clickup/implementation__implementation-09-storage-security-privacy.md)
- [10 App Lifecycle, Background State & Release](docs/clickup/implementation__implementation-10-app-lifecycle-and-release.md)
- [11 Testing Strategy & Quality Gate](docs/clickup/implementation__implementation-11-testing-strategy.md)
- [12 Architecture Decisions (ADR-01 to ADR-15)](docs/clickup/implementation__implementation-12-architecture-decisions-adr-01-to-adr-15.md)
- [13 Mobile BFF API V1 Contracts](docs/clickup/implementation__implementation-13-mobile-bff-api-v1.md)
- [14 User Accounts, Profile & Favorites](docs/clickup/implementation__implementation-14-accounts-profile-favorites.md)
- [15 Pickup & Remote Ordering](docs/clickup/implementation__implementation-15-pickup-remote-ordering.md)
- [16 Real-Time Status, SSE & Push Notifications](docs/clickup/implementation__implementation-16-real-time-status-and-push.md)
