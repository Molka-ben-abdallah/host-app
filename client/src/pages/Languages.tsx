import { useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ISO6391 from "iso-639-1";
import Select from "react-select";
const Languages = () => {
  const [languages, setLanguages] = useState([{ language: "", level: "" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setLanguages(updatedLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "" }]);
  };

  const deleteLanguage = (index: number) => {
    if (languages.length === 1) return;

    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
  };

  const validateForm = () => {
    for (const lang of languages) {
      if (!lang.language || !lang.level) {
        setErrorMessage("Please fill out all language fields.");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      languages: languages.map((lang) => ({
        name: lang.language,
        level: lang.level,
      })),
    };

    try {
      const userId = localStorage.getItem("userId");
      console.log("User ID retrieved from localStorage in Languages:", userId);
      if (!userId) {
        setErrorMessage("User ID is not available.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/profile/${userId}/languages`,
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
      console.log("Languages submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting languages:", error);
      setErrorMessage("Error submitting languages");
    }
  };

  const languageOptions = ISO6391.getAllNames().map((languageName) => ({
    value: languageName,
    label: languageName,
  }));

  return (
    <MainLayout
      title="Languages"
      tip="You should be able to read, write, and speak in your primary language. If you speak more languages, you can always add them to your experience page in the future"
      nextPage="/passions"
      validateForm={validateForm}
    >
      <form id="formId" ref={formRef} onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto flex flex-col items-start p-4">
          <p className="block text-gray-700 font-primaryRegular w-full p-2">
            What languages do you speak, and what is your proficiency level in
            each?
          </p>

          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}

          <div className="w-full max-w-4xl m-1">
            {languages.map((lang, index) => (
              <div key={index} className="flex gap-4 mb-4 items-center w-full">
                <div className="flex gap-2 w-full">
                  {/* Language Dropdown */}
                  <Select
                    options={languageOptions}
                    value={
                      lang.language
                        ? { value: lang.language, label: lang.language }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleChange(
                        index,
                        "language",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Select or type a language"
                    className="flex-1"
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: "1px solid #D1D5DB",
                        borderRadius: "0.375rem",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#D1D5DB",
                        },
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? "#D1D5DB" : "white",
                        color: isFocused ? "white" : "black",
                      }),
                    }}
                  />

                  {/* Level Dropdown */}
                  <select
                    value={lang.level}
                    onChange={(e) =>
                      handleChange(index, "level", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-[#FFAF20] text-gray-700 w-52 bg-white"
                    required
                  >
                    <option value="" disabled>
                      Level
                    </option>
                    <option className="hover:bg-gray-200" value="Native">
                      Native
                    </option>
                    <option className="hover:bg-gray-200" value="C2">
                      C2
                    </option>
                    <option className="hover:bg-gray-200" value="C1">
                      C1
                    </option>
                    <option className="hover:bg-gray-200" value="B2">
                      B2
                    </option>
                    <option className="hover:bg-gray-200" value="B1">
                      B1
                    </option>
                    <option className="hover:bg-gray-200" value="A2">
                      A2
                    </option>
                    <option className="hover:bg-gray-200" value="A1">
                      A1
                    </option>
                  </select>
                </div>

                {/* Delete button */}
                {languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteLanguage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}

            {/* Add a Language Button */}
            <button
              type="button"
              onClick={addLanguage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-md shadow-md hover:shadow-lg"
            >
              <img src="/Vector.svg" alt="Add Icon" className="w-5 h-5" />
              Add a Language
            </button>
          </div>
        </div>
      </form>
    </MainLayout>
  );
};

export default Languages;
