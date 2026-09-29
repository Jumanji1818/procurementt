# Procura — Adaptive Smart Procurement & Spend Management System
> **Final Year Project Capstone** in Computer Science / Software Engineering  
> **Author & Candidate:** Final Year Student  
> **Deployment Target:** Cross-Platform Web, Progressive Web App (PWA), and Standalone Android APK

---

## 📌 Project Overview & Abstract

**Procura** is an enterprise-grade, adaptive procurement and inventory management system architected to solve the rigid workflow dilemma in traditional ERP and procurement software. Unlike conventional systems that enforce rigid, bureaucratic enterprise workflows on small shops or inadequate informal procedures on large corporations, Procura introduces an **Adaptive Modular Procurement Architecture**.

The system dynamically modifies its procurement rules, approval thresholds, bidding processes, inventory linkage, and compliance requirements depending on the entity profile:
- **Micro-Retail / Solo Business:** Single-step instant procurement with auto-stocked inventory.
- **Growing SME / Creative Agency:** Two-tier managerial approval and direct vendor purchase orders.
- **Enterprise / Multi-Branch Conglomerate:** Full competitive RFQ bidding with weighted vendor scoring, multi-tier budget authorization, and automated 3-Way Matching.
- **Public Sector / Regulated Institution:** High-compliance sealed bidding, audit trails, and strict delivery inspection protocols.

---

## 🚀 Key Functional Capabilities

1. **Adaptive Workflow Engine**
   - Configurable approval matrix based on item category, amount thresholds, and department budgets.
   - Real-time delegation, escalation, and budget reservation before order commitment.

2. **Automated Multi-Location Inventory Tracking**
   - Stock levels linked directly to Goods Receipt Notes (GRN).
   - Automated reorder point alerts and safety stock triggers.

3. **Vendor Management & Real-Time Performance Analytics**
   - Supplier directory with real-time risk scores, on-time delivery rates, and quality ratings.
   - Document compliance tracker (tax clearance, business registration, ISO certifications).

4. **Automated 3-Way Matching (PO vs GRN vs Invoice)**
   - Algorithmic discrepancy detection between quantities ordered, quantities received, and invoice line totals with configurable tolerance thresholds.

5. **Competitive RFQ & Bidding Workspace**
   - Weighted multi-criteria vendor bid evaluation (Pricing, Delivery Time, Quality Score, Warranty).

6. **Procurement Calendar & Exception Center**
   - Proactive tracking of delivery deadlines, RFQ closing dates, contract renewals, and payment milestones.

7. **Multi-Language & Multi-Currency Engine**
   - Instant live localization: English (`en`), French (`fr`), Spanish (`es`), Hausa (`ha`), Swahili (`sw`), and Arabic (`ar`).
   - Live multi-currency conversion for **NGN (₦)**, **USD ($)**, **EUR (€)**, **GBP (£)**, **KES (KSh)**, **JPY (¥)**, and **AED**.

---

## 💻 Tech Stack & Architecture

- **Frontend Core:** React 19 (TypeScript), Tailwind CSS v4, Motion (Framer Motion)
- **Icons & Visuals:** Lucide React icons
- **State Management & Persistence:** Context API with unified transactional store & browser local storage
- **Mobile & Offline Support:** PWA Web App Manifest, Service Worker ready, Standalone Display mode
- **APK Target:** Capacitor 6 / PWABuilder (Android 8.0 to Android 15+)

---

## 📲 How to Run and Install on Phone / Laptop

### Option 1: Instant Mobile Installation (PWA - Recommended)
1. Open the live deployment link in **Google Chrome** on your Android smartphone.
2. Tap the browser menu (**⋮**) in the top right corner.
3. Tap **"Install App"** (or **"Add to Home screen"**).
4. The app will install to your Android home screen and app drawer with a native app icon and splash screen. It runs in full-screen standalone mode without any browser URL bar.

### Option 2: Generate Standalone `.apk` File in 1 Minute (PWABuilder)
1. Go to [PWABuilder.com](https://www.pwabuilder.com).
2. Enter your live app URL.
3. Click **"Start"** → click **"Package for Android"**.
4. Click **"Generate APK"** and download the compiled, signed `.apk` file directly to your phone.
5. Sideload and install the `.apk` on any Android device!

### Option 3: Compile Standalone Android APK using Capacitor & Android Studio
To compile a native APK locally on your computer:

```bash
# 1. Clone your repository or extract the project zip
git clone <YOUR_GITHUB_REPO_URL>
cd procura

# 2. Install dependencies
npm install

# 3. Install Capacitor packages for Android
npm install @capacitor/core @capacitor/cli @capacitor/android

# 4. Initialize Capacitor
npx cap init "Procura" "com.procura.app" --web-dir dist

# 5. Build production bundle
npm run build

# 6. Add Android platform
npx cap add android

# 7. Open in Android Studio to build APK
npx cap open android
```
Inside Android Studio:
- Select **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
- Locate the compiled APK at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🐙 How to Push this Project to Your GitHub

Follow these steps to upload the code to your GitHub account:

```bash
# 1. Download or extract the project zip file into a folder on your laptop
cd /path/to/procura

# 2. Initialize Git
git init

# 3. Add all files
git add .

# 4. Commit changes
git commit -m "feat: complete Procura Smart Procurement Management System capstone"

# 5. Create a new repository on https://github.com/new (e.g., named 'smart-procurement-system')

# 6. Link your local project to GitHub and push:
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/smart-procurement-system.git
git push -u origin main
```

---

## 🛠 Local Development Setup

To run the application locally on your laptop:

```bash
# Install node packages
npm install

# Start Vite dev server on port 3000
npm run dev

# Open your browser at
http://localhost:3000
```

---

## 🎓 University Final Year Defense Checklist

- [x] Adaptive entity configurations (Solo, Small Business, Enterprise, Public Sector)
- [x] Configurable multi-tier approval matrix
- [x] End-to-end procurement lifecycle (Requisition → RFQ → Bid Evaluation → PO → GRN → 3-Way Match → Payment)
- [x] Automated stock inventory ledger updated on goods receipt
- [x] Supplier performance risk scorecard & document compliance tracking
- [x] Spend analytics dashboard with category breakdown and monthly burn rate
- [x] Responsive layout with mobile navigation drawer, bottom bar, and desktop sidebar
- [x] Multi-language translation & real-time multi-currency support
- [x] Complete mobile PWA and APK distribution readiness
