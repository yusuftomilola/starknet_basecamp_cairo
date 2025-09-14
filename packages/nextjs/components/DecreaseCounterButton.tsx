"use client";

import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

interface DecreaseCounterButtonProps {
  counter: any;
}

export const DecreaseCounterButton = ({ counter }: DecreaseCounterButtonProps) => {
   const { sendAsync, status } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "decrease_counter",
    args: [],
  });

  const d: any = counter;
  const valueNum =
    typeof d === "bigint"
     ? Number(d)
     : typeof d === "number"
        ? d
        : typeof d === "string"
            ? d. startsWith("0x")
                ? parseInt(d, 16)
                : parseInt(d, 10)
            : Array.isArray(d)
                ? Number(d[0] ?? 0)
                : Number(d ?? 0);

  const counterValue = counter ? Number(counter) : 0;
  
  const isBusy = status === "pending";
  const isDisabled = isBusy || counter === undefined || valueNum <= 0; 

  return (
    <button 
      className="btn btn-primary btn-sm" 
      onClick={() => sendAsync()}
      disabled={isDisabled}
      title={valueNum <= 0 ? "Counter is already 0" : undefined}
    >
      {isBusy ? "Decreasing..." : "-1"}
    </button>
  );
};

