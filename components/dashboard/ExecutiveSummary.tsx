"use client";

import CompletionChart from "@/components/dashboard/CompletionChart";
import DurationChart from "@/components/dashboard/DurationChart";
import DropoffChart from "@/components/dashboard/DropoffChart";
import ImprovementChart from "@/components/dashboard/ImprovementChart";

export default function ExecutiveSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <CompletionChart />
      <DurationChart />
      <DropoffChart />
      <ImprovementChart />
    </div>
  );
}
