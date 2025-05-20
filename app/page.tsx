import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";
export default function Home() {
  return (
    <div className={"bg-accent"}>
      <h1 className={"text-center font-bold text-4xl p-10"}>
        Mobile Mystery House Analytics
      </h1>
      <ExecutiveSummary />
    </div>
  );
}
