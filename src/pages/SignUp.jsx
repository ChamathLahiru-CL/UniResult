import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Input from "../components/Input";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import logo from "../assets/images/logo.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    enrollmentNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.enrollmentNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Combine the email with the domain
      const fullEmail = `${formData.email}@std.uwu.ac.lk`;

      // Create the submission data with the full email
      const submissionData = {
        ...formData,
        email: fullEmail,
      };

      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registration successful:", submissionData);
      navigate("/"); // Redirect to login page after successful registration
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Combined Card with animation */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-700 ease-in-out transform hover:shadow-2xl">
        {/* Sign Up Form Side */}
        <div className="w-full md:w-1/2 bg-white p-4 md:p-5 flex flex-col justify-center relative overflow-hidden">
          {/* Animated decorative elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-tl-full opacity-50"></div>
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 -left-24 w-40 h-40 bg-indigo-100 rounded-full opacity-10"></div>

          <div className="relative z-10">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-2 tracking-tight">
                Create Your Account
              </h1>
              <p className="text-[14px] text-gray-600 max-w-md mx-auto">
                Join UniResult with your university ID to access exam results
                and academic resources.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 text-sm font-medium mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="block w-full pl-10 pr-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-all duration-300 hover:border-blue-300"
                    />
                  </div>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  University Email
                </label>
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exp01012"
                      autoComplete="universityEmail"
                      className="block w-full pl-10 pr-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-l-md"
                    />
                  </div>
                  <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md py-2.5 px-3 text-gray-500 text-sm">
                    @std.uwu.ac.lk
                  </div>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <label
                    htmlFor="enrollmentNumber"
                    className="block text-gray-700 text-sm font-medium mb-1"
                  >
                    Enrollment Number (username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M3.5 22V2L15 5.5V20.5L3.5 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 5.5L22 2V20.5L15 17.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19 8L10 11.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="enrollmentNumber"
                      name="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                      placeholder="Enter your enrollment number (exp/01/012)"
                      autoComplete="off"
                      className="block w-full pl-10 pr-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className="block w-full pl-10 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.5299 9.47004L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C12.9899 8.42004 13.8799 8.82004 14.5299 9.47004Z"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17.8201 5.76998C16.0701 4.44998 14.0701 3.72998 12.0001 3.72998C8.47009 3.72998 5.18009 5.80998 2.89009 9.40998C1.99009 10.82 1.99009 13.19 2.89009 14.6C3.68009 15.84 4.60009 16.91 5.60009 17.77"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.41992 19.5301C9.55992 20.0101 10.7699 20.2701 11.9999 20.2701C15.5299 20.2701 18.8199 18.1901 21.1099 14.5901C22.0099 13.1801 22.0099 10.8101 21.1099 9.40005C20.7799 8.88005 20.4199 8.39005 20.0499 7.93005"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.47 14.53L2 22"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 2L14.53 9.47"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58C10.0199 15.58 8.41992 13.98 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C13.9799 8.42004 15.5799 10.02 15.5799 12Z"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.9998 20.27C15.5298 20.27 18.8198 18.19 21.1098 14.59C22.0098 13.18 22.0098 10.81 21.1098 9.39997C18.8198 5.79997 15.5298 3.71997 11.9998 3.71997C8.46984 3.71997 5.17984 5.79997 2.88984 9.39997C1.98984 10.81 1.98984 13.18 2.88984 14.59C5.17984 18.19 8.46984 20.27 11.9998 20.27Z"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 text-sm font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className="block w-full pl-10 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.5299 9.47004L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C12.9899 8.42004 13.8799 8.82004 14.5299 9.47004Z"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17.8201 5.76998C16.0701 4.44998 14.0701 3.72998 12.0001 3.72998C8.47009 3.72998 5.18009 5.80998 2.89009 9.40998C1.99009 10.82 1.99009 13.19 2.89009 14.6C3.68009 15.84 4.60009 16.91 5.60009 17.77"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.41992 19.5301C9.55992 20.0101 10.7699 20.2701 11.9999 20.2701C15.5299 20.2701 18.8199 18.1901 21.1099 14.5901C22.0099 13.1801 22.0099 10.8101 21.1099 9.40005C20.7799 8.88005 20.4199 8.39005 20.0499 7.93005"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.47 14.53L2 22"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 2L14.53 9.47"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58C10.0199 15.58 8.41992 13.98 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C13.9799 8.42004 15.5799 10.02 15.5799 12Z"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.9998 20.27C15.5298 20.27 18.8198 18.19 21.1098 14.59C22.0098 13.18 22.0098 10.81 21.1098 9.39997C18.8198 5.79997 15.5298 3.71997 11.9998 3.71997C8.46984 3.71997 5.17984 5.79997 2.88984 9.39997C1.98984 10.81 1.98984 13.18 2.88984 14.59C5.17984 18.19 8.46984 20.27 11.9998 20.27Z"
                            stroke="#A0A0A0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-blue-50 bg-opacity-50 p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 mt-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeTerms"
                      className="text-gray-700 font-medium cursor-pointer"
                    >
                      I agree to the Terms and Privacy Policy
                    </label>
                    <p className="text-gray-500 mt-1">
                      By signing up, you agree to our{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors underline-offset-2 hover:underline"
                      >
                        Terms of Use
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors underline-offset-2 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    <span className="inline-flex items-center">
                      Sign Up Now
                      <svg
                        className="ml-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 rounded-full shadow-sm">
                    or sign up with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => console.log("Google signup clicked")}
                className="flex items-center justify-center w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                <span>Sign up with Google</span>
              </button>

              <div className="text-center mt-4 border-t border-gray-100 pt-4 flex flex-wrap justify-center">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium ml-1 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Branding Side with Blurred Background */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Enhanced blurred background elements with animations */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-blue-300 mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-blue-400 mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-indigo-300 mix-blend-multiply filter blur-lg opacity-70"></div>
            <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-blue-200 mix-blend-multiply filter blur-xl opacity-50"></div>
          </div>

          {/* Content with enhanced animations */}
          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center z-10">
            {/* Animated logo container with enhanced glow effect */}
            <div className="relative transform hover:scale-105 transition-transform duration-500 cursor-pointer mb-6">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 rounded-full blur-xl"></div>
              <div className="relative">
                <img
                  src={logo}
                  alt="UniResult Logo"
                  className="w-52 h-52 md:w-64 md:h-64 object-contain drop-shadow-lg"
                />
                <div className="absolute -inset-0.5 bg-white rounded-full opacity-20 blur"></div>
              </div>
              <div className="absolute -bottom-2 w-full h-4 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-md"></div>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-2">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
                Uni
              </span>
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">
                Result
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-700 max-w-md mb-3 leading-relaxed">
              Access your exam results, track academic progress, and get
              personalized insights to improve your performance.
            </p>

            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-sm border border-blue-100/50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="font-semibold text-gray-800 mb-2 text-base">
                Platform Features
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm">
                    Access to all your exam results instantly
                  </span>
                </li>
                <li className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm">
                    Real-time exam schedule updates
                  </span>
                </li>
                <li className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm">
                    Important notifications and announcements
                  </span>
                </li>
                <li className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm">
                    Performance analytics and insights
                  </span>
                </li>
                <li className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm">
                    Easy to download the exam results sheets
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
