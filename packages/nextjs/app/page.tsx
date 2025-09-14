"use client";

import { IncreaseCounterButton } from "~~/components/IncreaseCounterButton";
import { ConnectedAddress } from "../components/ConnectedAddress";
import { CounterValue } from "../components/CounterValue";
import { DecreaseCounterButton } from "~~/components/DecreaseCounterButton";
import { SetCounterForm } from "~~/components/SetCounterForm";
import { CounterEventHistory } from "~~/components/CounterEventHistory";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { ResetCounterButton } from "~~/components/ResetCounterButtton";

const Home = () => {
  const { data, isLoading, error } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  } as any);

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="text-lg flex items-center gap-3">
        Counter:{" "}
        <CounterValue value={data} isLoading={isLoading} error={error} />
        <IncreaseCounterButton />
        <DecreaseCounterButton counter={data} />
        <ResetCounterButton />
      </div>
      <div className="mt-4">
        <SetCounterForm current={data} />
      </div>
      <div className="mt-8 w-full max-w-6xl">
        <CounterEventHistory />
      </div>
    </div>
  );
};

export default Home;
