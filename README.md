# Xandeum Network Dashboard

An advanced analytics and monitoring platform for the [Xandeum](https://xandeum.network) storage network. This dashboard provides real-time visibility into the pNode ecosystem, offering validators and users a clear window into network health, performance, and decentralization.

![Dashboard Preview](https://i.imgur.com/your-screenshot-placeholder.png)

## 🚀 Mission

As part of the Xandeum developer bounty ecosystem, this project aims to deliver a **"Stakewiz-like" experience** for Xandeum pNodes. It moves beyond simple lists to provide actionable insights through rich visualizations and interactive data exploration.

## ✨ Key Features

- **🌌 Deep Space Aesthetics**: A premium, dark-mode-first UI featuring glassmorphism, dynamic gradients, and smooth transitions tailored for the Web3 standard.
- **⚡ Real-Time Network RPC**: Connects directly to the Xandeum gossip network via `xandeum-prpc` to discover active pods live.
- **📊 Interactive Data Grid**:
  - **Sortable Columns**: CPU, Memory, Disk, and Version sorting.
  - **Sparklines**: Visual 24h availability history for every node.
  - **Smart Pagination**: Handling large node sets with custom-styled controls.
  - **Heatmap Metrics**: Color-coded performance indicators for rapid issue spotting.
- **🌍 Geospatial Visualization**: Abstract world map highlighting active node clusters globally.
- **🔍 Deep Inspection**: Click any row to open the **Node Details Drawer**, revealing specific telemetry, uptime, and identity data without losing context.
- **📈 Automated Polling**: Powered by **TanStack Query**, the dashboard self-updates every 10 seconds to show the latest network state.

## 🛠 Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables
- **State & Data**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Tables**: [TanStack Table](https://tanstack.com/table/latest)
- **Protocol**: `xandeum-prpc` (Official Xandeum RPC Client)

## 📦 Project Structure

```bash
├── app/
│   ├── api/            # Next.js API Routes (Proxy for RPC)
│   ├── globals.css     # Design System & Deep Space Theme
│   ├── layout.tsx      # Root layout & QueryProviders
│   └── page.tsx        # Main Dashboard View
├── components/
│   ├── DataTable.tsx       # Reusable DataGrid with Pagination/Sorting
│   ├── NetworkOverview.tsx # Top KPI Cards (TPS, Total Nodes)
│   ├── NodeDetailsDrawer.tsx # Slide-out Inspector
│   ├── PNodeTable.tsx      # Main Node List Controller
│   └── WorldMap.tsx        # Geo Visualization
├── lib/
│   ├── prpcClient.ts   # Core RPC Logic & Data Mapping
│   └── types.ts        # TypeScript Interfaces (PNode, NetworkSummary)
└── public/             # Static Assets
```

## 🚀 Getting Started

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/xandeum-dashboard.git
    cd xandeum-dashboard
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    bun install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

4.  **Open the dashboard**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 RPC Configuration

The application currently connects to the hardcoded Xandeum test network seed nodes configured in `lib/prpcClient.ts`. No .env configuration is required for the default read-only dashboard mode.

## ⚖️ License

This project is open-source and available under the [MIT License](LICENSE).
