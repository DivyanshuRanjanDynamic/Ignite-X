import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Briefcase, Clock, Star, ArrowLeft, Building, 
  Users, Award, CheckCircle, ExternalLink, Share2, Bookmark 
} from "lucide-react";
import Navbar from "../components/Navbar";

function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Enhanced sample data aligned with PM Internship Scheme
  const internships = {
    1: { 
      title: "Digital India Intern", 
      company: "Ministry of Electronics & IT", 
      location: "Remote", 
      stipend: "₹12,000", 
      duration: "3 Months",
      category: "Government",
      type: "Remote",
      match: 95,
      description: "Work on digital transformation projects and e-governance initiatives. You'll be involved in developing digital solutions that help bridge the digital divide in rural areas and support the government's vision of a Digital India.",
      fullDescription: "As a Digital India Intern, you will work closely with our team to develop and implement digital solutions that support the government's vision of a Digital India. This internship offers hands-on experience in e-governance, digital literacy programs, and technology implementation in rural areas. You'll work on projects that directly impact citizens' lives and contribute to India's digital transformation journey.",
      requirements: ["Basic computer literacy", "Communication skills", "Interest in technology", "Problem-solving ability"],
      skills: ["Digital Literacy", "Communication", "Project Management", "Basic IT Skills"],
      perks: ["Certificate of Completion", "Letter of Recommendation", "Stipend", "Networking Opportunities", "Skill Development"],
      responsibilities: [
        "Assist in digital literacy training programs",
        "Support e-governance initiatives",
        "Help with data collection and analysis",
        "Participate in community outreach programs",
        "Contribute to project documentation"
      ],
      benefits: [
        "Gain hands-on experience in government technology projects",
        "Develop communication and project management skills",
        "Network with government officials and technology experts",
        "Contribute to India's digital transformation",
        "Receive mentorship from experienced professionals"
      ],
      applicationDeadline: "2024-02-15",
      startDate: "2024-03-01",
      endDate: "2024-05-31"
    },
    2: { 
      title: "Rural Development Intern", 
      company: "Ministry of Rural Development", 
      location: "Delhi", 
      stipend: "₹10,000", 
      duration: "6 Months",
      category: "Social Impact",
      type: "Onsite",
      match: 92,
      description: "Assist in rural development programs and community outreach initiatives. Work on projects that directly impact rural communities and contribute to sustainable development.",
      fullDescription: "Join our team in implementing various rural development schemes and programs. You'll work on ground-level projects that aim to improve the quality of life in rural areas, including infrastructure development, skill training, and community empowerment initiatives.",
      requirements: ["Interest in rural development", "Communication skills", "Field work willingness", "Basic research skills"],
      skills: ["Community Work", "Research", "Communication", "Project Management"],
      perks: ["Certificate of Completion", "Letter of Recommendation", "Stipend", "Field Experience", "Skill Development"],
      responsibilities: [
        "Assist in field surveys and data collection",
        "Support community development programs",
        "Help with documentation and reporting",
        "Participate in awareness campaigns",
        "Work with local communities and stakeholders"
      ],
      benefits: [
        "Gain practical experience in rural development",
        "Understand government schemes and policies",
        "Develop field work and research skills",
        "Make a direct impact on rural communities",
        "Build professional network in development sector"
      ],
      applicationDeadline: "2024-02-20",
      startDate: "2024-03-15",
      endDate: "2024-09-15"
    },
    3: { 
      title: "Skill Development Intern", 
      company: "Ministry of Skill Development", 
      location: "Mumbai", 
      stipend: "₹8,000", 
      duration: "4 Months",
      category: "Education",
      type: "Hybrid",
      match: 88,
      description: "Support skill development programs and vocational training initiatives. Help in creating and implementing training programs that enhance employability.",
      fullDescription: "Work with our team to develop and implement skill development programs across various sectors. You'll be involved in curriculum development, training delivery, and assessment of vocational training programs that help individuals gain marketable skills.",
      requirements: ["Interest in education and training", "Communication skills", "Basic computer skills", "Patience and empathy"],
      skills: ["Teaching", "Training", "Education", "Communication"],
      perks: ["Certificate of Completion", "Letter of Recommendation", "Stipend", "Training Experience", "Skill Development"],
      responsibilities: [
        "Assist in curriculum development",
        "Support training program delivery",
        "Help with trainee assessment",
        "Participate in program evaluation",
        "Contribute to training material development"
      ],
      benefits: [
        "Gain experience in skill development sector",
        "Develop teaching and training abilities",
        "Understand vocational education system",
        "Contribute to workforce development",
        "Build expertise in education technology"
      ],
      applicationDeadline: "2024-02-25",
      startDate: "2024-03-10",
      endDate: "2024-07-10"
    }
  };

  const internship = internships[id];

  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Internship not found</h1>
          <p className="text-gray-600 mb-6">The internship you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/internships")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Browse All Internships
          </button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    // Later: check auth → navigate to application form
    navigate("/login");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: internship.title,
        text: internship.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/internships")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Internships
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="w-5 h-5 mr-2" />
                    <span className="text-lg">{internship.company}</span>
                  </div>
                  <div className="flex items-center text-green-600 mb-4">
                    <Star className="w-5 h-5 mr-2" />
                    <span className="font-medium">{internship.match}% Match</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  {internship.category}
                </span>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{internship.location}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{internship.type}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{internship.duration}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-lg mr-2">💰</span>
                  <div>
                    <p className="text-sm text-gray-500">Stipend</p>
                    <p className="font-medium">{internship.stipend}/month</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Internship</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{internship.description}</p>
                <p className="text-gray-700 leading-relaxed">{internship.fullDescription}</p>
              </div>

              {/* Responsibilities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                <ul className="space-y-2">
                  {internship.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {internship.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills You'll Develop</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Gain</h2>
                <ul className="space-y-2">
                  {internship.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <Award className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Application Details</h3>
              
              {/* Timeline */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Application Deadline</p>
                  <p className="font-medium text-red-600">{new Date(internship.applicationDeadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium text-green-600">{new Date(internship.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium text-blue-600">{new Date(internship.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Perks */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">What You'll Get</h4>
                <ul className="space-y-2">
                  {internship.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition mb-4"
              >
                Apply Now
              </button>

              {/* Additional Actions */}
              <div className="space-y-2">
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                  Save for Later
                </button>
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                  Share with Friends
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetail;
