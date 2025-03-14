import React from "react";
import { useNavigate } from "react-router-dom";

type ButtonProps = {
  nextPage: string;
  formId?: string;
  validateForm?: () => boolean;
};

const Button: React.FC<ButtonProps> = ({ nextPage, formId, validateForm  }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (formId) {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        if (!form.checkValidity()) {  
          form.reportValidity(); // Show validation errors
          return; // Stop navigation
        }
        if (validateForm && !validateForm()) { 
          return; // Stop navigation if custom validation fails
        }
  
        // Dispatch form submission event (which should handle DB errors)
        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
  
        // Wait a moment to let DB validation process (only needed if your form submission is async)
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        // Check if the form has errors after submission (e.g., DB validation failed)
        const errorElements = document.querySelectorAll(".error-message"); 
        if (errorElements.length > 0) {
          return; // Stop navigation if DB errors exist
        }
      }
    }
  
    navigate(nextPage);
  };
  

  return (
    <button
      onClick={handleClick}
      className="w-40 p-3 bg-[#FFAF20] text-white rounded-lg text-lg cursor-pointer transition-all hover:bg-[#e68a00] bottom-5 right-5"
    >
      Continue
    </button>
  );
};

export default Button;
