import { GrowthRate } from "@/components/Dashboard/Home/GrowhtRate";
import LineAccessChart from "@/components/Dashboard/Home/LineAccessChart";
import QRCode from "@/components/Dashboard/Home/QRCode";
import { Welcome } from "@/components/Dashboard/Home/Welcome";

export default function Page() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <Welcome />
          </div>
          <GrowthRate />
          <QRCode />
        </div>
        {/* <LineAccessChart /> */}
      </div>
    </main>
  );
}
