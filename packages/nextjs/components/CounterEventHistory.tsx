"use client";

import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

export const CounterEventHistory = () => {
  const { data: events, isLoading, error } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n, // Start from block 0 to get all events since deployment
    watch: true, // Watch for new events
    blockData: true,
    transactionData: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <span className="loading loading-spinner loading-md"></span>
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading events: {String(error)}</span>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No counter events found
      </div>
    );
  }

  const getReasonText = (reason: any) => {
    switch (reason) {
      case 0: return "Increase";
      case 1: return "Decrease";
      case 2: return "Reset";
      case 3: return "Set";
      default: return "Unknown";
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (blockNumber: number) => {
    return `Block #${blockNumber}`;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Counter Event History</h3>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Event</th>
              <th>Old Value</th>
              <th>New Value</th>
              <th>Reason</th>
              <th>Caller</th>
              <th>Block</th>
              <th>Transaction</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="hover">
                <td>
                  <div className="badge badge-primary">
                    CounterChanged
                  </div>
                </td>
                <td className="font-mono">
                  {event.parsedArgs?.old_value || event.args?.old_value || "N/A"}
                </td>
                <td className="font-mono">
                  {event.parsedArgs?.new_value || event.args?.new_value || "N/A"}
                </td>
                <td>
                  <div className="badge badge-outline">
                    {getReasonText(event.parsedArgs?.reason || event.args?.reason)}
                  </div>
                </td>
                <td className="font-mono text-sm">
                  {formatAddress(event.parsedArgs?.caller || event.args?.caller || "N/A")}
                </td>
                <td className="font-mono text-sm">
                  {formatTimestamp(event.log?.block_number || "N/A")}
                </td>
                <td className="font-mono text-sm">
                  {event.log?.transaction_hash ? 
                    formatAddress(event.log.transaction_hash) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
