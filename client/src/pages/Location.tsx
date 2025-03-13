import React, { useRef, useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";

const Location = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [localYears, setLocalYears] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Log userId to ensure it is being fetched correctly
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID retrieved from localStorage in Location:", userId);

    if (!userId) {
      console.error("User ID is not available.");
      return; // Prevent API call if no userId
    }
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setInput(e.target.value);
  };

  const validateForm = () => {
    setErrorMessage(""); // Reset errors before validation

    // First & Last Name Validation
    if (city.length > 30 || city.length<3) {
      setErrorMessage("Enter a valid city name !");
      return false;
    }
    if (country.length > 30 || country.length<3) {
      setErrorMessage("Enter a valid country !");
      return false;
    }
    if (address.length > 30 || address.length<3) {
      setErrorMessage("Enter a valid address !");
      return false;
    }
    if (isNaN(Number(localYears)) || Number(localYears) <0  ) {
      setErrorMessage("Enter a valid number of years !");
      return false;
    }

    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current?.checkValidity() && validateForm()) {
      const locationData = {
        country: country,
        city: city,
        localYears: localYears,
        address: address,
      };

      console.log("Location data:", locationData);

      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}/location`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(locationData),
          }
        );
        console.log(
          `Sending PATCH request to: http://localhost:5000/api/profile/${userId}/location`
        );

        if (!response.ok) {
          throw new Error("Failed to update location");
        }

        const data = await response.json();
        console.log("Location updated successfully:", data);
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  };

  return (
    <div>
      <MainLayout
        title="Location informations"
        tip="It’s important that guests can see your face. No company logos, favorite pets, blank images, etc. We can’t accept photos that don’t show the real you."
        nextPage="/languages"
        validateForm={validateForm}
      >
        {errorMessage && <div className="text-red-500 font-primaryMedium flex items-center justify-center">{errorMessage}</div>}
        <div  className="flex justify-center">
          <form id='formId' className='w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 my-10 px-4 sm:px-0' ref={formRef} onSubmit={handleSubmit}>
            <Input 
                label='Your country'
                type='text'
                value={country}
                onChange={(e) => handleChange(e, setCountry)}
                placeholder=''
                required={true}
            />
            <Input 
                label='Your city name'
                type='text'
                value={city}
                onChange={(e) => handleChange(e, setCity)}
                placeholder=''
                required={true}
            />
            <Input 
                label='How many years have you been living in it ?'
                type='number'
                value={localYears}
                onChange={(e) => handleChange(e, setLocalYears)}
                placeholder=''
                required={true}
            />
            <Input 
                label='Address'
                type='text'
                value={address}
                onChange={(e) => handleChange(e, setAddress)}
                placeholder=''
                required={true}
            />
          </form>
        </div>
        
      </MainLayout>
    </div>
  );
};

export default Location;
