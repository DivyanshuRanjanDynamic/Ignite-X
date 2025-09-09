import { useParams } from "react-router-dom";
import { useState } from "react";
import { useStudentTranslation } from "../../hooks/useTranslation";

export default function ApplyForm() {
  const { id } = useParams(); // internship ID from URL
  const { t } = useStudentTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: "",
    coverLetter: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('applyForm.applicationSubmitted', { id }));
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          {t('applyForm.title', { id })}
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700">{t('applyForm.fullName')}</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">{t('applyForm.email')}</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">{t('applyForm.resumeLink')}</span>
          <input
            type="url"
            name="resume"
            value={formData.resume}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">{t('applyForm.coverLetter')}</span>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="4"
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {t('applyForm.submitApplication')}
        </button>
      </form>
    </div>
  );
}

