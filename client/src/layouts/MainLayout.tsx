import React, { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Tips from "../components/Tips";
import Button from "../components/Button";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  tip?: string;
  nextPage: string;
  validateForm?: () => boolean;
}

const steps = [
  { path: "./profile-information", title: "Profile Information" },
  { path: "/profile-photo", title: "Profile Photo" },
  { path: "/location", title: "Location" },
  { path: "/languages", title: "Languages" },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, tip, nextPage, validateForm  }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStepIndex");
    if (savedStep) {
      setCurrentStepIndex(parseInt(savedStep, 10));
    }
  }, []);

  useEffect(() => {
    const stepIndex = steps.findIndex((step) => step.path === location.pathname);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      localStorage.setItem("currentStepIndex", stepIndex.toString());
    }
  }, [location]);

  const goToStep = (index: number) => {
    if (index <= currentStepIndex) {
      navigate(steps[index].path);
    }
  };

  return (
    <div className="flex ">
      <Sidebar/>

      <div className="flex flex-col flex-1 p-4">
      {tip && <Tips title={title} text={tip} />}
        <main >{children}</main>
        
        <div className="mt-auto self-end">
          <Button nextPage={nextPage} formId="formId" validateForm={validateForm} />
        </div>
      </div>
      
      
    </div>
  );
};

export default MainLayout;
