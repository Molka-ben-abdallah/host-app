import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";

const Passions = () => {
  const [passions, setPassions] = useState<string[]>([""]);
  const [cityTrait, setCityTrait] = useState("");
  const [description, setDescription] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (index: number, value: string) => {
    const updatedPassions = [...passions];
    updatedPassions[index] = value;
    setPassions(updatedPassions);
  };

  const addPassion = () => {
    if (passions.length < 5) {
      setPassions([...passions, ""]);
    }
  };

  const deletePassion = (index: number) => {
    if (passions.length > 1) {
      const updatedPassions = passions.filter((_, i) => i !== index);
      setPassions(updatedPassions);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID retrieved from localStorage in passion:", userId);

    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
  }, []);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setInput(e.target.value);
  };

  // Submit the form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current?.checkValidity()) {
      const passionData = {
        passions: passions,
        description: description,
        cityTrait: cityTrait,
      };

      console.log("passion data:", passionData);

      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}/passion`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(passionData),
          }
        );
        console.log(
          `Sending PATCH request to: http://localhost:5000/api/profile/${userId}/passion`
        );

        if (!response.ok) {
          throw new Error("Failed to update passion");
        }

        const data = await response.json();
        console.log("Passions updated successfully:", data);
      } catch (error) {
        console.error("Error updating passions:", error);
      }
    }
  };

  return (
    <div>
      <MainLayout
        title="Passion"
        tip="What makes you uniquely qualified to host experiences? Tell guests why you’re passionate and knowledgeable about the subject matter. Keep in mind: Hosting is about person-to-person connection, so make sure this section focuses on you"
        nextPage="/overview"
      >
        <div className="flex justify-center">
          <form
            className="w-full max-w-4xl grid grid-cols-1 my-5 px-4 sm:px-0"
            id="formId"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="px-8">
              <label className="block text-gray-700 font-primaryRegular">
                What are you passionate about?
              </label>
              {passions.map((passion, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={passion}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="Enter passion"
                    required
                    className="font-primaryRegular justify-center w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFAF20] text-gray-700"
                  />
                  {passions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deletePassion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={addPassion}
                  className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <img src="/Vector.svg" alt="Add Icon" className="w-5 h-5" />
                  Add Passion
                </button>
              </div>
            </div>
            <Input
              label="What do you love most about your city?"
              type="text"
              value={cityTrait}
              onChange={(e) => handleTextChange(e, setCityTrait)}
              placeholder="Enter Your city traits"
              required={true}
            />

            <div className="px-8">
              <label
                htmlFor="description"
                className="block text-gray-700 font-primaryRegular"
              >
                Describe yourself more:
              </label>
              <textarea
                className="w-full font-primaryRegular justify-center w-100 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFAF20]"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                cols={20}
                placeholder="Enter Your description"
                required
              />
            </div>
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default Passions;
