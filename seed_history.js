const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'network_stats.json');

function generateMockHistory()
{
    const stats = [];
    const now = Date.now();

    // Generate 24 * 60 = 1440 points (one per minute for last 24h)
    // This ensures we have enough data for the "hourly" aggregator to work with
    const points = 24 * 60;

    for (let i = points; i >= 0; i--) {
        const time = now - (i * 60 * 1000);

        // Create a nice curve
        // Base score around 85-95, dipping slightly during "night"
        const hour = new Date(time).getHours();
        let baseScore = 90;
        if (hour >= 2 && hour <= 6) baseScore = 85;
        if (hour >= 18 && hour <= 22) baseScore = 94;

        // Add some noise
        const randomVar = (Math.random() * 4) - 2;
        const score = Math.min(100, Math.max(60, Math.round(baseScore + randomVar)));

        const totalNodes = 200 + Math.floor(Math.random() * 10);
        const onlineNodes = Math.round((score / 100) * totalNodes);

        stats.push({
            timestamp: time,
            totalNodes,
            onlineNodes,
            score
        });
    }

    const data = {
        stats,
        logs: []
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log(`Generated ${stats.length} mock history points for the last 24 hours.`);
}

generateMockHistory();
