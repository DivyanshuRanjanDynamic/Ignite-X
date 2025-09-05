import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Clock } from "lucide-react";

export default function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const internshipData = [
    {
      id: "1",
      title: "Frontend Developer Intern",
      company: "Tech Solutions",
      location: "Bangalore, India",
      type: "Remote",
      duration: "3 Months",
      stipend:"1000k",
      description: "Work on modern React applications and improve frontend features.",
    },
    {
      id: "2",
      title: "AI Research Intern",
      company: "Innovate AI Labs",
      location: "Hyderabad, India",
      type: "Hybrid",
      stipend:"20000k",
      duration: "6 Months",
      description: "Assist in AI research projects, data analysis, and algorithm design.",
    },
    {
      id: "3",
      title: "Full Stack Developer Intern",
      company: "NextGen Web",
      location: "Delhi, India",
      type: "Onsite",
      stipend:"15000k",
      duration: "2 Months",
      description: "Full stack development using Node.js and React.",
    },
  ];

  const internship = internshipData.find((item) => item.id === id);
  if (!internship) return <p>Internship not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{internship.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{internship.company}</p>

        <p className="flex items-center text-gray-600 text-sm mb-1">
          <MapPin size={16} className="mr-2 text-red-500" />
          {internship.location}
        </p>

        <p className="flex items-center text-gray-600 text-sm mb-1">
          <Briefcase size={16} className="mr-2 text-blue-500" />
          {internship.type}
        </p>

        <p className="flex items-center text-gray-600 text-sm mb-4">
          <Clock size={16} className="mr-2 text-green-500" />
          {internship.duration}
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Description:</h3>
        <p className="text-gray-700">{internship.description}</p>
      </div>
    </div>
  );
}

