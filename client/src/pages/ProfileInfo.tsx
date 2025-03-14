import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";

const ProfileInfo: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is not available.");
      return; // Prevent API call if no userId
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setInput(e.target.value);
  };

  const validateForm = () => {
    setErrorMessage(""); // Reset errors before validation

    // First & Last Name Validation
    if (firstName.length < 3 || firstName.length > 20) {
      setErrorMessage("Enter a valid First name !");
      return false;
    }
    if (lastName.length < 3 || lastName.length > 50) {
      setErrorMessage("Enter a valid Last name ! ");
      return false;
    }

    // Birthday Validation (Must be 18+)
    const selectedDate = new Date(birthday);
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
    if (selectedDate > minAgeDate) {
      setErrorMessage("You must be at least 18 years old.");
      return false;
    }
    setErrorMessage("");

    // Email Validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Mobile Number Validation
    const mobileRegex = /^\+?\d{4,15}$/;
    if (!mobileRegex.test(mobile)) {
      setErrorMessage("Please enter a valid mobile number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current?.checkValidity() && validateForm()) {
      const formData = {
        firstName,
        lastName,
        birthday,
        nationality,
        email,
        mobile,
      };

      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}/profileInfo`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        const data = await response.json();
        console.log("Form submitted successfully:", data);
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrorMessage("Error submitting form");
      }
    } else {
      formRef.current?.reportValidity();
    }
  };

  return (
    <div>
      <MainLayout
        title="Profile Informations"
        tip="Guests want to know who’s hosting them. This must be your actual name, not the name of a business. Only your first name will appear on your page. If you have co-hosts, you'll be able to add them later."
        nextPage="/profile-photo"
        validateForm={validateForm}
      >
        {errorMessage && <div className="text-red-500 font-primaryMedium flex items-center justify-center">{errorMessage}</div>}
        <div className="flex justify-center">
          <form
            className=" w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 my-10 px-4 sm:px-0"
            id="formId"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => handleChange(e, setFirstName)}
              placeholder="Enter your first name"
              required={true}
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => handleChange(e, setLastName)}
              placeholder="Enter your last name"
              required={true}
            />
            <Input
              label="Birthday"
              type="date"
              value={birthday}
              onChange={(e) => handleChange(e, setBirthday)}
              placeholder=""
              required={true}
            />
            <Input
              label="Nationality"
              type="text"
              value={nationality}
              onChange={(e) => handleChange(e, setNationality)}
              placeholder="Enter your nationality"
              required={true}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => handleChange(e, setEmail)}
              placeholder="Enter your email"
              required={true}
            />
            <Input
              label="Mobile"
              type="tel"
              value={mobile}
              onChange={(e) => handleChange(e, setMobile)}
              placeholder="Enter your mobile number"
              required={true}
            />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default ProfileInfo;
