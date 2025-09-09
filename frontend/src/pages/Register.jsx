import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, MapPin, GraduationCap, User, ArrowRight, ArrowLeft, CheckCircle, Eye, EyeOff, Upload, Camera, Info, Check, X, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthTranslation } from '../hooks/useTranslation.jsx';
import { authToasts } from '../utils/toast.jsx';

function Register() {
  const { t, tCommon } = useAuthTranslation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('technical');
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    
    // Step 2: Education & Skills
    education: "",
    degree: "",
    institution: "",
    graduationYear: "",
    domain: "",
    skills: [],
    experience: "",
    
    // Step 3: Location & Preferences
    state: "",
    city: "",
    interests: [],
    workPreference: "",
    
    // Step 4: Security & Profile
    password: "",
    confirmPassword: "",
    resume: null,
    profilePhoto: null,
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-500' };
      case 2: return { text: 'Weak', color: 'text-orange-500' };
      case 3: return { text: 'Fair', color: 'text-yellow-500' };
      case 4: return { text: 'Good', color: 'text-blue-500' };
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: 'Very Weak', color: 'text-red-500' };
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch(stepNumber) {
      case 1:
        if (!formData.name.trim()) newErrors.name = t('register.validation.requiredField');
        if (!formData.email.trim()) newErrors.email = t('register.validation.requiredField');
        else if (!validateEmail(formData.email)) newErrors.email = t('register.validation.invalidEmail');
        if (!formData.phone.trim()) newErrors.phone = t('register.validation.requiredField');
        else if (!validatePhone(formData.phone)) newErrors.phone = t('register.validation.invalidPhone');
        break;
      case 2:
        if (!formData.education) newErrors.education = t('register.validation.requiredField');
        if (!formData.domain) newErrors.domain = t('register.validation.requiredField');
        if (formData.skills.length === 0) newErrors.skills = t('register.validation.selectAtLeastOne');
        break;
      case 3:
        if (!formData.state) newErrors.state = t('register.validation.requiredField');
        if (formData.interests.length === 0) newErrors.interests = t('register.validation.selectAtLeastOne');
        break;
      case 4:
        if (!formData.password) newErrors.password = t('register.validation.requiredField');
        else if (!validatePassword(formData.password)) newErrors.password = t('register.validation.passwordTooShort');
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('register.validation.passwordMismatch');
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleArrayChange = (name, value, isChecked = true) => {
    let newArray;
    if (isChecked) {
      newArray = [...formData[name], value];
    } else {
      newArray = formData[name].filter(item => item !== value);
    }
    setFormData({ ...formData, [name]: newArray });
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      authToasts.registerError(t('register.validation.passwordMismatch'));
      return;
    }
    
    setIsLoading(true);
    try {
      // Build payload compatible with backend
      const payload = { ...formData };

      // Normalize gender to backend enum to avoid 422 validation errors
      if (payload.gender) {
        const gv = String(payload.gender).trim().toLowerCase();
        if (gv === 'male') payload.gender = 'MALE';
        else if (gv === 'female') payload.gender = 'FEMALE';
        else if (gv === 'other') payload.gender = 'OTHER';
        else if (['prefernottosay','prefer_not_to_say','prefer-not-to-say','prefer not to say'].includes(gv)) {
          payload.gender = 'PREFER_NOT_TO_SAY';
        } else {
          // If it's an unexpected value, omit it so backend treats as optional
          delete payload.gender;
        }
      }

      // Ensure interests/skills are arrays of strings
      payload.skills = Array.isArray(formData.skills) ? formData.skills : [];
      payload.interests = Array.isArray(formData.interests) ? formData.interests : [];

      // Send to backend
      const res = await import('../api/auth.js').then(m => m.registerStudent(payload));

      // After successful registration, DO NOT auto-login. Ask user to verify email.
      const email = formData.email;
      authToasts.registerSuccess();
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
      }, 2000);
    } catch (err) {
      console.error('Registration failed', err);
      const details = err?.response?.data?.error?.details;
      const firstDetail = Array.isArray(details) && details.length ? `${details[0].field}: ${details[0].message}` : null;
      const message = firstDetail || err?.response?.data?.error?.message || 'Registration failed. Please check your details and try again.';
      authToasts.registerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = [
    { title: t('register.steps.basicInfo.title'), icon: User, description: t('register.steps.basicInfo.description') },
    { title: t('register.steps.educationSkills.title'), icon: GraduationCap, description: t('register.steps.educationSkills.description') },
    { title: t('register.steps.locationInterests.title'), icon: MapPin, description: t('register.steps.locationInterests.description') },
    { title: t('register.steps.security.title'), icon: Brain, description: t('register.steps.security.description') },
  ];

  // Indian States
  const indianStates = [
    { value: 'andhraPradesh', label: t('register.indianStates.andhraPradesh') },
    { value: 'arunachalPradesh', label: t('register.indianStates.arunachalPradesh') },
    { value: 'assam', label: t('register.indianStates.assam') },
    { value: 'bihar', label: t('register.indianStates.bihar') },
    { value: 'chhattisgarh', label: t('register.indianStates.chhattisgarh') },
    { value: 'goa', label: t('register.indianStates.goa') },
    { value: 'gujarat', label: t('register.indianStates.gujarat') },
    { value: 'haryana', label: t('register.indianStates.haryana') },
    { value: 'himachalPradesh', label: t('register.indianStates.himachalPradesh') },
    { value: 'jharkhand', label: t('register.indianStates.jharkhand') },
    { value: 'karnataka', label: t('register.indianStates.karnataka') },
    { value: 'kerala', label: t('register.indianStates.kerala') },
    { value: 'madhyaPradesh', label: t('register.indianStates.madhyaPradesh') },
    { value: 'maharashtra', label: t('register.indianStates.maharashtra') },
    { value: 'manipur', label: t('register.indianStates.manipur') },
    { value: 'meghalaya', label: t('register.indianStates.meghalaya') },
    { value: 'mizoram', label: t('register.indianStates.mizoram') },
    { value: 'nagaland', label: t('register.indianStates.nagaland') },
    { value: 'odisha', label: t('register.indianStates.odisha') },
    { value: 'punjab', label: t('register.indianStates.punjab') },
    { value: 'rajasthan', label: t('register.indianStates.rajasthan') },
    { value: 'sikkim', label: t('register.indianStates.sikkim') },
    { value: 'tamilNadu', label: t('register.indianStates.tamilNadu') },
    { value: 'telangana', label: t('register.indianStates.telangana') },
    { value: 'tripura', label: t('register.indianStates.tripura') },
    { value: 'uttarPradesh', label: t('register.indianStates.uttarPradesh') },
    { value: 'uttarakhand', label: t('register.indianStates.uttarakhand') },
    { value: 'westBengal', label: t('register.indianStates.westBengal') },
    { value: 'delhiNCT', label: t('register.indianStates.delhiNCT') },
    { value: 'chandigarh', label: t('register.indianStates.chandigarh') },
    { value: 'jammuKashmir', label: t('register.indianStates.jammuKashmir') },
    { value: 'ladakh', label: t('register.indianStates.ladakh') },
    { value: 'puducherry', label: t('register.indianStates.puducherry') },
  ];

  // Education levels
  const educationLevels = [
    { value: 'belowTenth', label: t('register.options.education.belowTenth') },
    { value: 'tenth', label: t('register.options.education.tenth') },
    { value: 'twelfth', label: t('register.options.education.twelfth') },
    { value: 'diploma', label: t('register.options.education.diploma') },
    { value: 'undergraduate', label: t('register.options.education.undergraduate') },
    { value: 'postgraduate', label: t('register.options.education.postgraduate') },
    { value: 'doctorate', label: t('register.options.education.doctorate') },
    { value: 'other', label: t('register.options.education.other') },
  ];

  // Domain options
  const domains = [
    { value: 'technology', label: t('register.options.domains.technology'), icon: '💻' },
    { value: 'healthcare', label: t('register.options.domains.healthcare'), icon: '🏥' },
    { value: 'education', label: t('register.options.domains.education'), icon: '📚' },
    { value: 'finance', label: t('register.options.domains.finance'), icon: '💰' },
    { value: 'marketing', label: t('register.options.domains.marketing'), icon: '📢' },
    { value: 'engineering', label: t('register.options.domains.engineering'), icon: '🔧' },
    { value: 'design', label: t('register.options.domains.design'), icon: '🎨' },
    { value: 'agriculture', label: t('register.options.domains.agriculture'), icon: '🌾' },
    { value: 'government', label: t('register.options.domains.government'), icon: '🏛️' },
    { value: 'nonprofit', label: t('register.options.domains.nonprofit'), icon: '🤝' },
    { value: 'media', label: t('register.options.domains.media'), icon: '📺' },
    { value: 'tourism', label: t('register.options.domains.tourism'), icon: '✈️' },
    { value: 'other', label: t('register.options.domains.other'), icon: '🌍' },
  ];

  // Skills by category
  const skillsData = {
    technical: [
      { value: 'webDevelopment', label: t('register.skills.technical.webDevelopment'), icon: '💻' },
      { value: 'mobileDevelopment', label: t('register.skills.technical.mobileDevelopment'), icon: '📱' },
      { value: 'dataAnalysis', label: t('register.skills.technical.dataAnalysis'), icon: '📊' },
      { value: 'digitalMarketing', label: t('register.skills.technical.digitalMarketing'), icon: '📈' },
      { value: 'cyberSecurity', label: t('register.skills.technical.cyberSecurity'), icon: '🔒' },
      { value: 'cloudComputing', label: t('register.skills.technical.cloudComputing'), icon: '☁️' },
      { value: 'artificialIntelligence', label: t('register.skills.technical.artificialIntelligence'), icon: '🤖' },
      { value: 'softwareTesting', label: t('register.skills.technical.softwareTesting'), icon: '🧪' },
      { value: 'databaseManagement', label: t('register.skills.technical.databaseManagement'), icon: '🗄️' },
      { value: 'networking', label: t('register.skills.technical.networking'), icon: '🌐' },
    ],
    creative: [
      { value: 'graphicDesign', label: t('register.skills.creative.graphicDesign'), icon: '🎨' },
      { value: 'uiuxDesign', label: t('register.skills.creative.uiuxDesign'), icon: '✨' },
      { value: 'videoEditing', label: t('register.skills.creative.videoEditing'), icon: '🎬' },
      { value: 'photography', label: t('register.skills.creative.photography'), icon: '📸' },
      { value: 'contentWriting', label: t('register.skills.creative.contentWriting'), icon: '✍️' },
      { value: 'socialMediaManagement', label: t('register.skills.creative.socialMediaManagement'), icon: '📱' },
      { value: 'animation', label: t('register.skills.creative.animation'), icon: '🎭' },
      { value: 'webDesign', label: t('register.skills.creative.webDesign'), icon: '🖥️' },
    ],
    business: [
      { value: 'projectManagement', label: t('register.skills.business.projectManagement'), icon: '📋' },
      { value: 'businessAnalysis', label: t('register.skills.business.businessAnalysis'), icon: '📈' },
      { value: 'sales', label: t('register.skills.business.sales'), icon: '💼' },
      { value: 'customerSupport', label: t('register.skills.business.customerSupport'), icon: '🎧' },
      { value: 'humanResources', label: t('register.skills.business.humanResources'), icon: '👥' },
      { value: 'accounting', label: t('register.skills.business.accounting'), icon: '📊' },
      { value: 'marketResearch', label: t('register.skills.business.marketResearch'), icon: '🔍' },
      { value: 'entrepreneurship', label: t('register.skills.business.entrepreneurship'), icon: '🚀' },
    ],
    communication: [
      { value: 'publicSpeaking', label: t('register.skills.communication.publicSpeaking'), icon: '🎤' },
      { value: 'writing', label: t('register.skills.communication.writing'), icon: '✏️' },
      { value: 'translation', label: t('register.skills.communication.translation'), icon: '🌐' },
      { value: 'teaching', label: t('register.skills.communication.teaching'), icon: '📚' },
      { value: 'counseling', label: t('register.skills.communication.counseling'), icon: '🤝' },
      { value: 'eventManagement', label: t('register.skills.communication.eventManagement'), icon: '🎉' },
    ],
    trades: [
      { value: 'electricalWork', label: t('register.skills.trades.electricalWork'), icon: '⚡' },
      { value: 'plumbing', label: t('register.skills.trades.plumbing'), icon: '🔧' },
      { value: 'carpentry', label: t('register.skills.trades.carpentry'), icon: '🔨' },
      { value: 'welding', label: t('register.skills.trades.welding'), icon: '🔥' },
      { value: 'tailoring', label: t('register.skills.trades.tailoring'), icon: '✂️' },
      { value: 'cooking', label: t('register.skills.trades.cooking'), icon: '🍳' },
      { value: 'driving', label: t('register.skills.trades.driving'), icon: '🚗' },
      { value: 'mechanicalRepair', label: t('register.skills.trades.mechanicalRepair'), icon: '🔧' },
      { value: 'beautician', label: t('register.skills.trades.beautician'), icon: '💄' },
      { value: 'agriculture', label: t('register.skills.trades.agriculture'), icon: '🌾' },
    ],
  };

  // Career interests
  const careerInterests = [
    { value: 'leadership', label: t('register.careerInterests.leadership'), icon: '👑' },
    { value: 'innovation', label: t('register.careerInterests.innovation'), icon: '💡' },
    { value: 'socialImpact', label: t('register.careerInterests.socialImpact'), icon: '🌟' },
    { value: 'entrepreneurship', label: t('register.careerInterests.entrepreneurship'), icon: '🚀' },
    { value: 'publicService', label: t('register.careerInterests.publicService'), icon: '🏛️' },
    { value: 'international', label: t('register.careerInterests.international'), icon: '🌍' },
    { value: 'workLifeBalance', label: t('register.careerInterests.workLifeBalance'), icon: '⚖️' },
    { value: 'highEarning', label: t('register.careerInterests.highEarning'), icon: '💰' },
    { value: 'creativity', label: t('register.careerInterests.creativity'), icon: '🎨' },
    { value: 'technology', label: t('register.careerInterests.technology'), icon: '💻' },
    { value: 'environment', label: t('register.careerInterests.environment'), icon: '🌱' },
    { value: 'education', label: t('register.careerInterests.education'), icon: '📚' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('register.title')}</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {t('register.subtitle')}
          </p>
        </motion.div>
      </div>

      {/* Progress Tracker */}
      <div className="flex justify-center mb-6 sm:mb-8 px-4">
        <div className="flex space-x-1 sm:space-x-2 md:space-x-8 max-w-4xl w-full">
          {stepTitles.map((stepInfo, index) => {
            const Icon = stepInfo.icon;
            const isActive = step === index + 1;
            const isCompleted = step > index + 1;
            
            return (
              <motion.div 
                key={index} 
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <span className={`text-xs sm:text-sm font-medium ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {stepInfo.title}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {stepInfo.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 md:px-8">
        <motion.div 
          className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-blue-100 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {t('register.steps.basicInfo.heading')}
                    </h2>
                    <p className="text-gray-600">{t('register.steps.basicInfo.subheading')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.fullName')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder={t('register.placeholders.fullName')}
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder={t('register.placeholders.email')}
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.phone')} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t('register.placeholders.phone')}
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.dateOfBirth')}
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 60)).toISOString().split('T')[0]}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.gender')}
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="">{t('register.options.gender.select')}</option>
                        <option value="male">{t('register.options.gender.male')}</option>
                        <option value="female">{t('register.options.gender.female')}</option>
                        <option value="other">{t('register.options.gender.other')}</option>
                        <option value="preferNotToSay">{t('register.options.gender.preferNotToSay')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Help Text */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">Why we need this information:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Personal details help us create your profile</li>
                          <li>• Contact information ensures you receive important updates</li>
                          <li>• Optional fields help us provide better recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center"
                    >
                      {t('register.buttons.continue')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Education & Skills */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {t('register.steps.educationSkills.heading')}
                    </h2>
                    <p className="text-gray-600">{t('register.steps.educationSkills.subheading')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.education')} *
                      </label>
                      <select
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.education ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">{t('register.options.education.select')}</option>
                        {educationLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                      {errors.education && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.education}
                        </p>
                      )}
                    </div>

                    {/* Degree/Course */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.degree')}
                      </label>
                      <input
                        type="text"
                        name="degree"
                        placeholder={t('register.placeholders.degree')}
                        value={formData.degree}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    {/* Institution */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.institution')}
                      </label>
                      <input
                        type="text"
                        name="institution"
                        placeholder={t('register.placeholders.institution')}
                        value={formData.institution}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    {/* Graduation Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.graduationYear')}
                      </label>
                      <select
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="">{t('register.graduationYears.select')}</option>
                        {Array.from({length: 12}, (_, i) => {
                          const year = new Date().getFullYear() + 6 - i;
                          return (
                            <option key={year} value={year}>{year}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Domain Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t('register.fields.domain')} *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {domains.map((domain) => {
                        const isSelected = formData.domain === domain.value;
                        return (
                          <button
                            type="button"
                            key={domain.value}
                            onClick={() => setFormData({ ...formData, domain: domain.value })}
                            className={`flex flex-col items-center p-4 border rounded-xl text-sm transition ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            <span className="text-2xl mb-2">{domain.icon}</span>
                            <span className="text-center">{domain.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.domain && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {errors.domain}
                      </p>
                    )}
                  </div>

                  {/* Skills Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t('register.fields.skills')} *
                    </label>
                    
                    {/* Skill Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.keys(skillsData).map((category) => (
                        <button
                          type="button"
                          key={category}
                          onClick={() => setSelectedSkillCategory(category)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            selectedSkillCategory === category
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {t(`register.skillCategories.${category}`)}
                        </button>
                      ))}
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                      {skillsData[selectedSkillCategory].map((skill) => {
                        const isSelected = formData.skills.includes(skill.value);
                        return (
                          <button
                            type="button"
                            key={skill.value}
                            onClick={() => {
                              handleArrayChange('skills', skill.value, !isSelected);
                            }}
                            className={`flex items-center p-3 border rounded-xl text-sm transition ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            <span className="mr-2">{skill.icon}</span>
                            <span className="text-left">{skill.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    
                    {formData.skills.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <Check className="w-4 h-4 inline mr-1" />
                          Selected {formData.skills.length} skill(s)
                        </p>
                      </div>
                    )}
                    
                    {errors.skills && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {errors.skills}
                      </p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('register.fields.experience')}
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">{t('register.options.experience.select')}</option>
                      <option value="fresher">{t('register.options.experience.fresher')}</option>
                      <option value="lessThanYear">{t('register.options.experience.lessThanYear')}</option>
                      <option value="oneToTwo">{t('register.options.experience.oneToTwo')}</option>
                      <option value="twoToFive">{t('register.options.experience.twoToFive')}</option>
                      <option value="moreThanFive">{t('register.options.experience.moreThanFive')}</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      {t('register.buttons.back')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center"
                    >
                      {t('register.buttons.continue')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Location & Preferences */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {t('register.steps.locationInterests.heading')}
                    </h2>
                    <p className="text-gray-600">{t('register.steps.locationInterests.subheading')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.state')} *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">{t('register.indianStates.select')}</option>
                        {indianStates.map(state => (
                          <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.state}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.fields.city')}
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Work Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('register.fields.workPreference')}
                    </label>
                    <select
                      name="workPreference"
                      value={formData.workPreference}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">{t('register.options.workPreference.select')}</option>
                      <option value="remote">{t('register.options.workPreference.remote')}</option>
                      <option value="onsite">{t('register.options.workPreference.onsite')}</option>
                      <option value="hybrid">{t('register.options.workPreference.hybrid')}</option>
                      <option value="noPreference">{t('register.options.workPreference.noPreference')}</option>
                    </select>
                  </div>

                  {/* Career Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t('register.fields.interests')} *
                    </label>
                    <p className="text-sm text-gray-500 mb-4">{t('register.careerInterests.select')}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                      {careerInterests.map((interest) => {
                        const isSelected = formData.interests.includes(interest.value);
                        return (
                          <button
                            type="button"
                            key={interest.value}
                            onClick={() => {
                              handleArrayChange('interests', interest.value, !isSelected);
                            }}
                            className={`flex items-center p-3 border rounded-xl text-sm transition ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            <span className="mr-2">{interest.icon}</span>
                            <span className="text-left">{interest.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    
                    {formData.interests.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <Check className="w-4 h-4 inline mr-1" />
                          Selected {formData.interests.length} interest(s)
                        </p>
                      </div>
                    )}
                    
                    {errors.interests && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {errors.interests}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      {t('register.buttons.back')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center"
                    >
                      {t('register.buttons.continue')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Resume & Security */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Complete Your Profile
                    </h2>
                    <p className="text-gray-600">Final step to get your AI recommendations</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        📄 Upload Resume (Optional)
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Don't have a resume? No worries — you can{" "}
                        <span className="text-blue-600 font-semibold">
                          create one easily
                        </span>{" "}
                        after signup!
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleChange}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <div className="text-gray-400 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 10MB)</p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🔑 Secure Your Account
                      </h3>
                      <div className="space-y-4">
                        {/* Password field with show/hide and strength */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="Create a strong password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              required
                            />
                            <button
                              type="button"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>

                          {/* Strength Indicator */}
                          {formData.password && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Password Strength:</span>
                                <span className={getPasswordStrengthText(getPasswordStrength(formData.password)).color}>
                                  {getPasswordStrengthText(getPasswordStrength(formData.password)).text}
                                </span>
                              </div>
                              <div className="flex space-x-1 mt-1">
                                {[1,2,3,4,5].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full ${
                                      getPasswordStrength(formData.password) >= level
                                        ? level <= 2 ? 'bg-red-400' : level <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Use at least 8 characters. Adding upper/lowercase, numbers and symbols makes it stronger.</p>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password with show/hide */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              required
                            />
                            <button
                              type="button"
                              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                              <X className="w-4 h-4 mr-1" /> Passwords do not match
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Complete Registration
                        </div>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
