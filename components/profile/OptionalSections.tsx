export function OptionalSections() {
  // TODO: Integrate with react-hook-form for dynamic sections
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Optional Sections</h2>
      {/* Expandable section logic will go here */}
      <div className="space-y-2">
        <button className="w-full border rounded px-3 py-2">Add Gamer Info</button>
        <button className="w-full border rounded px-3 py-2">Add Trader Info</button>
        <button className="w-full border rounded px-3 py-2">Add Creator Info</button>
        {/* More sections as needed */}
      </div>
    </section>
  );
} 