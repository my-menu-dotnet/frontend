import { GrowthRate } from "@/components/Dashboard/Home/GrowhtRate";
import LineAccessChart from "@/components/Dashboard/Home/LineAccessChart";
import { Welcome } from "@/components/Dashboard/Home/Welcome";

export default function Page() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-wrap flex-row gap-4">
          <Welcome />
          <GrowthRate />
        </div>
        <LineAccessChart />
      </div>
    </main>
  );
}
