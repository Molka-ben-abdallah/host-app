import React, { useState, useRef } from "react";
import axios from "axios";

interface ImageUploadProps {
  userId: string;
  onImageUpload: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ userId, onImageUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const defaultImg = "defaultImg.png";
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Create a reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      handleUpload(selectedFile); // Automatically upload the file after selection
    }
  };

  const handleUpload = async (selectedFile?: File) => {
    const fileToUpload = selectedFile || file;
    if (!fileToUpload) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileToUpload);

    try {
      const { data } = await axios.post<{ imageUrl: string }>(
        `http://localhost:5000/api/upload/${userId}`,
        formData
      );
      onImageUpload(data.imageUrl); 
      setSuccessMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Upload failed");
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex justify-center">
      
      <div>
      <div className={`${errorMessage ? "text-red-500" : "text-green-600"} font-primaryMedium flex items-center justify-center`}>
  {errorMessage || successMessage }
</div>
      <img
        src={preview || defaultImg}
        alt="Preview"
        className="w-[200px] h-[200px] rounded-full my-5"
      />
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
     
        onClick={handleButtonClick}
        className="font-primaryRegular bg-[#E5E5E5] text-black px-10 py-3 rounded-lg hover:bg-[#D1D1D1] flex"
      >
        <img src="photoIcon.png" alt="upload icon" className="pr-3"/>
        Upload Picture
      </button>
      </div>
      
    </div>
  );
};

export default ImageUpload;