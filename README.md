# SMILE-FOOD

A modern, full-stack food delivery and multi-vendor marketplace platform built with React, Vite, Tailwind CSS, and Supabase.

## Features

- **Multi-Role RBAC Portals**: Dedicated, role-based workflows for Administrators, Customers, Restaurant Vendors, and Delivery Riders.
- **Customer Portal**: Browse restaurant dishes, live cart management, checkout with escrow holding, and real-time delivery tracking.
- **Vendor Dashboard**: Catalogue management, live order dispatching, and earnings reporting.
- **Rider Portal**: Delivery routing, order handoff, and payout tracking.
- **Admin & Moderation**: Double-entry ledger audit trail, transaction dispute resolution, user role management, and analytics.
- **Transactions & Receipt Downloads**: Complete transaction history with instant, high-fidelity PDF receipt generation for orders and wallet payments.
- **Localized Currency**: Standardized in Nigerian Naira (`₦` / `NGN`) across menus, checkout, wallet balance, and invoices.
- **Supabase Backend**: Real-time subscriptions, PostgreSQL authentication, Row-Level Security (RLS) policies, and ledger integrity.

## Test & Demo User Accounts

Use these pre-configured demo credentials to sign in and explore the role-specific portals:

| Role | Email Address | Password | Portal & Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smilefood.com` | `SmileFood2026!` | Full executive dashboard, ledger audit trail, user moderation, and financial controls. |
| **Customer** | `customer@smilefood.com` | `SmileFood2026!` | Explore menu catalogues, add to cart, live order tracking, transaction history, and receipt downloads. |
| **Vendor** (Restaurant Owner) | `vendor@smilefood.com` | `SmileFood2026!` | Menu management, live kitchen orders, sales metrics, and payout ledger. |
| **Rider** (Courier) | `rider@smilefood.com` | `SmileFood2026!` | Dispatch requests, live map telemetry, delivery completions, and earnings. |

> **Note:** Any password with at least 6 characters (e.g. `password123` or `SmileFood2026!`) is accepted for test accounts in demo mode.

## Transaction History & Digital Receipts

- **Wallet Transactions**: Navigate to `/wallet` to view your complete credit and debit ledger. Click the **Receipt** button on any transaction to download an official PDF receipt.
- **Order Receipts**: Navigate to `/customer/orders` (or view any order in Orders / Overview) to download an itemized food purchase receipt with escrow certification.

## Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Tailwind CSS v4, Lucide Icons, Recharts
- **PDF Generation**: jsPDF
- **Backend / Database**: Supabase (PostgreSQL, Auth, RLS policies, Realtime)
- **Tooling**: Oxlint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/eosis267/SMILE-FOOD.git
cd SMILE-FOOD
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```
