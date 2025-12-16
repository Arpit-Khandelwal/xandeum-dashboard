# Deployment & Usage Guide

## 📚 Documentation Link

The primary documentation for this project, including setup, architecture, and feature overviews, can be found in the main **[README.md](./README.md)** file.

---

## 🚀 Deployment Instructions

### Option 1: Local Development

To run the Xandeum Dashboard on your local machine:

1.  **Prerequisites**: Ensure you have `Node.js` (v18+) and a package manager like `npm`, `pnpm`, or `bun` installed.
2.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd xandeum-dashboard
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    # or
    bun install
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Access the Dashboard**:
    Open your browser to `http://localhost:3000`. The dashboard connects automatically to the Xandeum seed nodes defined in `lib/prpcClient.ts`.

### Option 2: Production Build

To build the application for production usage:

```bash
npm run build
npm start
```

### Option 3: Vercel Deployment (Recommended)

This project is optimized for Next.js. To deploy to the cloud:

1.  Push your code to a GitHub repository.
2.  Import the repository into [Vercel](https://vercel.com).
3.  Click **Deploy**. No custom environment variables are initially required as the RPC endpoints are currently public.

---

## 📖 Usage Manual

### 1. Network Overview

The top section provides a high-level health check of the Xandeum network:

- **Total Nodes**: The count of active pNodes discovered in the gossip network.
- **Storage Capacity**: Aggregated storage available across the network.
- **Transactions (TPS)**: Real-time network throughput.

### 2. Active pNodes Table

This is the main explorer view.

- **Sorting**: Click column headers (e.g., _CPU_, _Version_) to sort data.
- **Filtering**: Use the pagination controls at the bottom to navigate large lists.
- **Visual Indicators**:
  - **Green Dot**: Node is Online (< 5 mins since last contact).
  - **Sparklines**: "Avail (24h)" shows a visual history of reliability.
  - **Flags**: Indicates the geographical region of the node.

### 3. Node Details Inspector

To inspect a specific node without navigating away:

1.  **Click any row** in the pNodes table.
2.  A **Side Drawer** will slide in from the right.
3.  View detailed telemetry including:
    - Full Public Key (Copyable)
    - Detailed Hardware Stats (CPU, Memory, Disk)
    - Network Identity (IP, Port)
    - Uptime Duration
