import React from "react";
import { useNavigate } from "react-router-dom";

type ButtonProps = {
  nextPage: string;
  formId?: string;
};

const Button: React.FC<ButtonProps> = ({ nextPage, formId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (formId) {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        if (!form.checkValidity()) {
          form.reportValidity(); 
          return; 
        }
        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
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
