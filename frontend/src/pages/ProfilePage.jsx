import { useState, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../services/authApi";
import { useUpgradeToExpertMutation } from "../services/userApi";
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
      await upgradeToExpert(expertFormData).unwrap();
      setIsUpgradeModalOpen(false);
      setMessage("Congratulations! You are now an Expert.");
      refetch(); // Reload to update Role UI
    } catch (err) {
      setError(err.data?.message || "Failed to upgrade to expert.");
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
                        Register as Expert
                      </h3>
                      <div className="mt-2 text-sm text-gray-500 mb-4">
                        Please provide your details to apply for an expert
                        account.
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    disabled={isUpgrading}
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    {isUpgrading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "Register Now"
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
