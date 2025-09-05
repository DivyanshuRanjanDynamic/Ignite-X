// src/pages/student/Recommended.jsx
import { MapPin, Briefcase, Clock, Bookmark, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Recommendation() {
  const navigate = useNavigate();

  const recommendations = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Solutions",
      location: "Bangalore, India",
      type: "Remote",
      duration: "3 Months",
      description: "Work on modern React applications and improve frontend features.",
    },
    {
      id: 2,
      title: "AI Research Intern",
      company: "Innovate AI Labs",
      location: "Hyderabad, India",
      type: "Hybrid",
      duration: "6 Months",
      description: "Assist in AI research projects, data analysis, and algorithm design.",
    },
    {
      id: 3,
      title: "Full Stack Developer Intern",
      company: "NextGen Web",
      location: "Delhi, India",
      type: "Onsite",
      duration: "2 Months",
      description: "Full stack development using Node.js and React.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">🎯 Recommended Internships</h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out"
          >
            <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{rec.company}</p>

            <p className="flex items-center text-gray-600 text-sm mb-1">
              <MapPin size={16} className="mr-2 text-red-500" />
              {rec.location}
            </p>

            <p className="flex items-center text-gray-600 text-sm mb-1">
              <Briefcase size={16} className="mr-2 text-blue-500" />
              {rec.type}
            </p>

            <p className="flex items-center text-gray-600 text-sm mb-4">
              <Clock size={16} className="mr-2 text-green-500" />
              {rec.duration}
            </p>

            <div className="flex gap-2 justify-between">
              {/* Apply Now */}
          <button
          onClick={() => navigate(`/apply/${rec.id}`)}
          className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-1.5 py-1 rounded-md text-xs hover:bg-blue-700 transition duration-200"
        >
          Apply Now
        </button>

              {/* Save Button */}
             <button
           className="flex-1 flex items-center justify-center gap-1 bg-gray-200 text-gray-800 px-1.5 py-1 rounded-md text-xs hover:bg-gray-300 transition duration-200"
         >
           <Bookmark size={12} /> Save
        </button>


        {/* View Details */}
           <button
          onClick={() => navigate(`/internship-details/${rec.id}`)}
          className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white px-1.5 py-1 rounded-md text-xs hover:bg-green-700 transition duration-200"
         >
       <Eye size={12} /> View Details
       </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







