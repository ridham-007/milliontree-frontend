import Events from "../components/Events";

export default async function EventsLayout() {
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <Events />
    </div>
  );
}
