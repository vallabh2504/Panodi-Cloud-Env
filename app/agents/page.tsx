import LogFeed from '@/components/LogFeed';

export default function AgentsPage() {
  return (
    <div className="p-6 flex flex-col h-full gap-4" style={{ height: 'calc(100vh - 0px)' }}>
      <div>
        <h1 className="text-2xl font-bold text-white">Agent Activity Feed</h1>
        <p className="text-gray-400 text-sm mt-1">Live stream of all agent thoughts, actions, and errors.</p>
      </div>
      <div className="flex-1 min-h-0">
        <LogFeed />
      </div>
    </div>
  );
}
