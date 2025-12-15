
const { PrpcClient } = require('xandeum-prpc');

const seeds = [
    "173.212.220.65",
    "161.97.97.41",
    "192.190.136.36",
    "192.190.136.38",
    "207.244.255.1",
    "192.190.136.28",
    "192.190.136.29",
    "173.212.203.145",
];

async function main()
{
    for (const seed of seeds) {
        try {
            console.log(`Connecting to ${seed}...`);
            const client = new PrpcClient(seed);
            // Try to call getPodsWithStats
            // We need to know if this function exists. If not we fall back to getPods
            try {
                const stats = await client.getPodsWithStats();
                console.log("getPodsWithStats result:", JSON.stringify(stats, null, 2));
                return;
            } catch (e) {
                console.log("getPodsWithStats failed, trying getPods");
                const pods = await client.getPods();
                console.log("getPods result:", JSON.stringify(pods, null, 2));
                return;
            }
        } catch (error) {
            console.warn(`Failed to connect to seed ${seed}:`, error.message);
        }
    }
}

main();
