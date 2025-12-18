export async function register()
{
    console.log("Instrumentation hook triggered...");
    if (process.env.NEXT_RUNTIME === 'nodejs' || !process.env.NEXT_RUNTIME) {
        console.log("Registering background poller...");
        const { startPolling } = await import("@/lib/db");
        startPolling(30000); // 30 seconds
    }
}
