import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import ImageUpload from "../components/ImageUpload";

const ProfilePhoto = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID retrieved from localStorage in ProfilePhoto:", userId);
    
    if (userId) {
      setUserId(userId);
    } else {
      console.error("User ID is not available.");
    }
  }, []);
  
  const isImageUploaded = Boolean(imageUrl);
  
  return (
    <div>
      <MainLayout
        title="Profile Photo"
        tip="It’s important that guests can see your face. No company logos, favorite pets, blank images, etc. We can’t accept photos that don’t show the real you."
        nextPage="/location"
        validateForm={() => isImageUploaded}
      >
        <div className='flex justify-center'>
          <form id="formId" ref={formRef} 
          
           >
           
          </form>
          <div className="text-center ">
              
              {userId && <ImageUpload userId={userId} onImageUpload={setImageUrl} />}
              <p className="font-primaryMedium justify-center ">Provide a photo that shows your face</p>    
              <p className="font-primaryLight justify-center ">We can’t accept logos, abstract images, pet portraits, etc. If<br/> you have Co-Hosts or assistants, they’ll add their photo later.</p>
            </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default ProfilePhoto;