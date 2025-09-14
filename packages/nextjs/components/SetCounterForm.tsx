"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

export const SetCounterForm = ({ current }: { current: any }) => {
  const [value, setValue] = useState<string>(
    current !== undefined ? String(current) : "0",
  );
  
  const { sendAsync, status } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: [parseInt(value) || 0],
  } as any);

  const isBusy = status === "pending";
  const parsed = (() => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return undefined;
    return n;
  })();

  return (
    <form 
        className="flex items-center gap-2"
        onSubmit={(e) => {
            e.preventDefault();
            if (parsed === undefined) return;
            sendAsync();
        }}
    >
        <input
            className="flex items-center gap-2"
            type="number"
            min={0}
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        <button
            className="btn btn-secondary btn-sm"
            type="submit"
            disabled={isBusy || parsed === undefined}
            title={parsed === undefined ? "Enter a non-negative integer" : undefined}
        >
            {isBusy ? "Setting..." : "Set"}
      </button>
    </form>
  );
};
