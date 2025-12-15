"use client";

export default function ActivityLog()
{
    const activities = [
        { id: 1, type: 'join', msg: 'New pNode joined the network', time: '2 mins ago', node: 'Node-8F2A' },
        { id: 2, type: 'sync', msg: 'Epoch 204 sync completed', time: '5 mins ago', node: 'Cluster-EU' },
        { id: 3, type: 'warn', msg: 'High latency detected', time: '12 mins ago', node: 'Node-3B1C' },
        { id: 4, type: 'join', msg: 'New pNode joined the network', time: '15 mins ago', node: 'Node-9C4D' },
        { id: 5, type: 'sync', msg: 'Storage proof verified', time: '22 mins ago', node: 'Node-1A2B' },
    ];

    return (
        <div className="h-full">
            <h2 className="mb-4 text-sm font-semibold uppercase text-muted tracking-wider">Network Activity</h2>
            <div className="flex flex-col gap-4">
                {activities.map((act) => (
                    <div key={act.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${act.type === 'join' ? 'bg-[var(--status-online)]' :
                                act.type === 'warn' ? 'bg-[var(--status-offline)]' : 'bg-[var(--primary)]'
                            }`} />
                        <div>
                            <p className="text-sm text-[var(--text-main)] font-medium leading-none mb-1">{act.msg}</p>
                            <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                                <span className="font-mono text-[var(--primary)] opacity-80">{act.node}</span>
                                <span>•</span>
                                <span>{act.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <button className="text-xs text-[var(--primary)] mt-2 hover:underline text-left">View All Logs →</button>
            </div>
        </div>
    );
}
