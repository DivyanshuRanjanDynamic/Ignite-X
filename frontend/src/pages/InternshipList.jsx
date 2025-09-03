import { useState } from "react";
import { Link } from "react-router-dom";

function InternshipList() {
  const [search, setSearch] = useState("");

  // Temporary sample data (later replace with backend fetch)
  const internships = [
    { id: 1, title: "Frontend Developer Intern", company: "Tech Corp", location: "Remote", stipend: "₹10,000", duration: "3 Months" },
    { id: 2, title: "AI Research Intern", company: "AI Labs", location: "Bangalore", stipend: "₹15,000", duration: "6 Months" },
    { id: 3, title: "Marketing Intern", company: "StartUpX", location: "Delhi", stipend: "₹8,000", duration: "2 Months" },
  ];

  const filteredInternships = internships.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Available Internships</h1>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Search by role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>

      {/* Internship Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInternships.map((internship) => (
          <div key={internship.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600">{internship.title}</h2>
            <p className="text-gray-600">{internship.company}</p>
            <p className="mt-2 text-sm">📍 {internship.location}</p>
            <p className="text-sm">💰 {internship.stipend}</p>
            <p className="text-sm">⏳ {internship.duration}</p>

            <Link
              to={`/internship/${internship.id}`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InternshipList;
