import React from 'react';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center px-8">
        <img src="/blackLogo.png" alt="Logo" className=" top-4 left-4 w-16 pb-5" />
        <h1 className="font-primaryBold text-3xl md:text-4xl">
          Welcome! <br /> Your hosting journey starts here.
        </h1>
        <p className="mt-4 font-primaryRegular">
          Tabaani Experiences are small group activities and tours led by passionate local hosts like you...
          <br /><br />
          All experience ideas are reviewed by a small team at Tabaani. If your idea meets our quality standards, you’ll get to add dates and start hosting.
          <br /><br />
          We’re excited to learn more about you, and what you’d like to share with the world.
        </p>

        {/* Button aligned to the right */}
        <div className="flex justify-end my-10">
          <Button nextPage="/profile-information" />
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="md:w-1/2 h-full">
        <img src="/landingImg.png" alt="Landing" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Landing;