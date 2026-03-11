import AllTable from "./AllTable.tsx/AllTable";

export default function Home() {
  return (
    <>
      <div className="m-8 text-3xl">Express Entry Tracker</div>
      <div className="flex flex-row justify-end gap-4 mr-8">
        <div className="p-4 rounded-md bg-gray-100">Candidates</div>
        <div className="p-4 rounded-md bg-gray-100">Each Draw</div>
      </div>
      <AllTable />
    </>
  );
}
