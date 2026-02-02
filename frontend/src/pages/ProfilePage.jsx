import { useState, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../services/authApi";
import { useUpgradeToExpertMutation, useUpdateExpertProfileMutation } from "../services/userApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";

const ProfilePage = () => {
  const {
    data: userResponse,
    isLoading: isUserLoading,
    refetch,
  } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [upgradeToExpert, { isLoading: isUpgrading }] =
    useUpgradeToExpertMutation();
  const [updateExpertProfile, { isLoading: isExpertUpdating }] = useUpdateExpertProfileMutation();

  const user = userResponse?.data;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    balance: 0,
    role: "",
  });

  // Expert Upgrade State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [expertFormData, setExpertFormData] = useState({
    bio: "",
    specialization: "",
    hourlyRate: "",
    videoUrl: "",
    imageUrl: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        email: user.email || "",
        balance: user.balance || 0,
        role: user.role || "CUSTOMER",
      });
    }
  }, [user]);

  // Pre-fill Expert Data if exists
  useEffect(() => {
    if (user?.expertProfile) {
      const { bio, specialization, hourlyRate, videoUrl, imageUrl, socialLinks } = user.expertProfile;
      setExpertFormData({
        bio: bio || "",
        specialization: specialization || "",
        hourlyRate: hourlyRate || "",
        videoUrl: videoUrl || "",
        imageUrl: imageUrl || "",
        socialLinks: {
          facebook: socialLinks?.facebook || "",
          instagram: socialLinks?.instagram || "",
          linkedin: socialLinks?.linkedin || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
    setError("");
  };

  const handleExpertChange = (e) => {
    setExpertFormData({
      ...expertFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialChange = (e) => {
    setExpertFormData({
      ...expertFormData,
      socialLinks: {
        ...expertFormData.socialLinks,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }).unwrap();

      setMessage("Profile updated successfully!");
      refetch();
    } catch (err) {
      setError(err.data?.message || "Failed to update profile.");
    }
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      
      // Branch based on current role
      const isEditing = formData.role === "EXPERT";
      
      let result;
      if (isEditing) {
         result = await updateExpertProfile(expertFormData).unwrap();
         setMessage("Expert Profile updated successfully.");
      } else {
         result = await upgradeToExpert(expertFormData).unwrap();
         const { user, token } = result.data;
         dispatch(setCredentials({ user, token }));
         setMessage("Congratulations! You are now an Expert.");
      }

      setIsUpgradeModalOpen(false);
      refetch(); 
    } catch (err) {
      setError(err.data?.message || "Failed to save expert profile.");
    }

  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
            <p className="text-primary-100">Manage your account information</p>
          </div>
          {formData.role === "EXPERT" && (
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              ★ EXPERT
            </span>
          )}
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar / Read-only info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs text-gray-400">Email</span>
                    <span className="font-medium text-gray-800 break-words">
                      {formData.email}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">Balance</span>
                    <span className="font-bold text-green-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(formData.balance)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">
                      Account Type
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        formData.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : formData.role === "EXPERT"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {formData.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upgrade Button for Customers */}
              {formData.role === "CUSTOMER" && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <h3 className="text-blue-800 font-semibold mb-2">
                    Want to earn money?
                  </h3>
                  <p className="text-sm text-blue-600 mb-4">
                    Become an expert and offer your services to others.
                  </p>
                  <Button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full"
                  >
                    Register as Expert
                  </Button>
                </div>
              )}
            </div>

            {/* Main Form */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Personal Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="+84..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="input-field w-full"
                      placeholder="123 Street, District, City..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? <LoadingSpinner size="sm" /> : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        
          {/* Expert Profile View */}
          {formData.role === "EXPERT" && user?.expertProfile && (
            <div className="mt-8 border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Expert Profile</h2>
                <Button onClick={() => setIsUpgradeModalOpen(true)} variant="outline">
                  Edit Expert Profile
                </Button>
              </div>

               <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Avatar & Key Info */}
                  <div className="text-center md:text-left">
                    <img 
                      src={user.expertProfile.imageUrl || "https://via.placeholder.com/150"} 
                      alt="Expert Avatar" 
                      className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0 border-4 border-white shadow-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
                    <p className="text-primary-600 font-medium">{user.expertProfile.specialization}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(user.expertProfile.hourlyRate)} / hour
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 justify-center md:justify-start mt-4">
                      {user.expertProfile.socialLinks?.facebook && (
                        <a href={user.expertProfile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                           FB
                        </a>
                      )}
                      {user.expertProfile.socialLinks?.instagram && (
                        <a href={user.expertProfile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                           IG
                        </a>
                      )}
                      {user.expertProfile.socialLinks?.linkedin && (
                        <a href={user.expertProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                           LI
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bio & Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">About Me</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {user.expertProfile.bio || "No bio added yet."}
                      </p>
                    </div>

                    {user.expertProfile.videoUrl && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Introduction Video</h4>
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                           {/* Simple link or iframe attempt */}
                           {user.expertProfile.videoUrl.includes('youtube') || user.expertProfile.videoUrl.includes('youtu.be') ? (
                             <iframe 
                               src={user.expertProfile.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                               title="Expert Video"
                               className="w-full h-full min-h-[300px]"
                               frameBorder="0"
                               allowFullScreen
                             ></iframe>
                           ) : (
                             <a href={user.expertProfile.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                               Watch Video
                             </a>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsUpgradeModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpgradeSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        {formData.role === "EXPERT" ? "Update Expert Profile" : "Register as Expert"}
                      </h3>
                      <div className="mt-2 text-sm text-gray-500 mb-4">
                        {formData.role === "EXPERT" 
                          ? "Update your expert profile details below." 
                          : "Please provide your details to apply for an expert account."}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Specialization
                          </label>
                          <input
                            type="text"
                            name="specialization"
                            value={expertFormData.specialization}
                            onChange={handleExpertChange}
                            className="input-field w-full"
                            placeholder="e.g. Tennis Coach, Yoga Instructor"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hourly Rate (VND)
                          </label>
                          <input
                            type="number"
                            name="hourlyRate"
                            value={expertFormData.hourlyRate}
                            onChange={handleExpertChange}
                            className="input-field w-full"
                            placeholder="e.g. 200000"
                            min="0"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio / Introduction
                          </label>
                          <textarea
                            name="bio"
                            value={expertFormData.bio}
                            onChange={handleExpertChange}
                            className="input-field w-full"
                            rows="3"
                            placeholder="Tell us about your experience..."
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Image URL (Avatar)
                          </label>
                          <input
                            type="text"
                            name="imageUrl"
                            value={expertFormData.imageUrl}
                            onChange={handleExpertChange}
                            className="input-field w-full"
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Introduction Video URL
                          </label>
                          <input
                            type="text"
                            name="videoUrl"
                            value={expertFormData.videoUrl}
                            onChange={handleExpertChange}
                            className="input-field w-full"
                            placeholder="https://youtube.com/..."
                          />
                        </div>
                         <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Social Links
                          </label>
                          <div className="space-y-2">
                             <input
                              type="text"
                              name="facebook"
                              value={expertFormData.socialLinks?.facebook || ""}
                              onChange={handleSocialChange}
                              className="input-field w-full"
                              placeholder="Facebook Profile URL"
                            />
                             <input
                              type="text"
                              name="instagram"
                              value={expertFormData.socialLinks?.instagram || ""}
                              onChange={handleSocialChange}
                              className="input-field w-full"
                              placeholder="Instagram Profile URL"
                            />
                             <input
                              type="text"
                              name="linkedin"
                              value={expertFormData.socialLinks?.linkedin || ""}
                              onChange={handleSocialChange}
                              className="input-field w-full"
                              placeholder="LinkedIn Profile URL"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    disabled={isUpgrading || isExpertUpdating}
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    {(isUpgrading || isExpertUpdating) ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      formData.role === "EXPERT" ? "Save Changes" : "Register Now"
                    )}
                  </Button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsUpgradeModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
