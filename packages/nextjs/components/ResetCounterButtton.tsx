"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark/useDeployedContractInfo";

export const ResetCounterButton = () => {
  const [needsApproval, setNeedsApproval] = useState(true);
  
  // Get CounterContract address for approval
  const { data: counterContract } = useDeployedContractInfo("CounterContract");
  
  // STRK approval hook
  const { sendAsync: approveStrk, status: approveStatus } = useScaffoldWriteContract({
    contractName: "Strk",
    functionName: "approve",
    args: [counterContract?.address, "1000000000000000000"], // 1 STRK in wei
  });

  // Reset counter hook
  const { sendAsync: resetCounter, status: resetStatus } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "reset_counter",
    args: [],
  });

  const isApproving = approveStatus === "pending";
  const isResetting = resetStatus === "pending";
  const isBusy = isApproving || isResetting;

  const handleAction = async () => {
    if (needsApproval) {
      try {
        await approveStrk();
        setNeedsApproval(false);
      } catch (error) {
        console.error("Approval failed:", error);
      }
    } else {
      try {
        await resetCounter();
        setNeedsApproval(true); // Reset for next time
      } catch (error) {
        console.error("Reset failed:", error);
      }
    }
  };

  const getButtonText = () => {
    if (isApproving) return "Approving STRK...";
    if (isResetting) return "Resetting...";
    return needsApproval ? "Approve STRK (1)" : "Reset Counter";
  };

  const getButtonClass = () => {
    return needsApproval ? "btn btn-info btn-sm" : "btn btn-warning btn-sm";
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleAction}
      disabled={isBusy}
      title={needsApproval ? "Approve 1 STRK for the contract to spend" : "Reset counter to 0 (requires 1 STRK payment)"}
    >
      {getButtonText()}
    </button>
  );
};