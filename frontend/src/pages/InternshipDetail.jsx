import { useParams, useNavigate } from "react-router-dom";

function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Temporary sample data
  const internships = {
    1: { title: "Frontend Developer Intern", company: "Tech Corp", location: "Remote", stipend: "₹10,000", duration: "3 Months", description: "Work with React and Tailwind to build UI components.", requirements: ["React basics", "HTML/CSS", "Git knowledge"], perks: ["Certificate", "Flexible Hours", "Job Offer"] },
    2: { title: "AI Research Intern", company: "AI Labs", location: "Bangalore", stipend: "₹15,000", duration: "6 Months", description: "Assist in research on AI/ML projects.", requirements: ["Python", "Machine Learning basics"], perks: ["Certificate", "Letter of Recommendation", "Stipend"] },
  };

  const internship = internships[id];

  if (!internship) return <p className="p-8">Internship not found.</p>;

  const handleApply = () => {
    // Later: check auth → navigate to application form
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{internship.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{internship.company}</p>

        <p className="mb-2">📍 {internship.location}</p>
        <p className="mb-2">💰 {internship.stipend}</p>
        <p className="mb-4">⏳ {internship.duration}</p>

        <h2 className="text-xl font-semibold mb-2">About the Internship</h2>
        <p className="mb-4 text-gray-700">{internship.description}</p>

        <h2 className="text-xl font-semibold mb-2">Requirements</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700">
          {internship.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Perks</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          {internship.perks.map((perk, idx) => (
            <li key={idx}>{perk}</li>
          ))}
        </ul>

        <button
          onClick={handleApply}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default InternshipDetail;
