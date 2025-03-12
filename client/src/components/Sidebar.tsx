import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(1);

  const handleStepClick = (step: number) => {
    setSelectedStep(step === selectedStep ? null : step);
  };

  const getClass = (link: string): string => {
    return location.pathname === link
      ? 'block py-1 px-2 bg-[rgba(255,175,32,0.2)] font-primaryMedium w-full border-l-4 border-l-yellow-500 pl-10'
      : 'block py-1 px-2 font-primaryLight pl-10';
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 p-2  z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <img src="white.svg" alt="" height={20} width={20} /> :  <img src="blue.svg" alt=""  width={20}/>}
      </button>

      <aside 
        className={`bg-[#10455B] text-white h-screen max-md:fixed max-md:top-0 max-md:left-0 max-md:w-64 max-md:transition-transform max-md:duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <img src="/logo.png" alt="Logo" className="my-7 mx-auto" />
        <h2 className="text-lg font-primaryBold mb-4 px-6">Your Hosting <br/>Application Process</h2>
        <nav>
          <ul>
            {[ 
              { step: 1, title: 'STEP 01: ABOUT YOU', links: [
                { path: '/profile-information', label: 'Profile Information' },
                { path: '/profile-photo', label: 'Profile Photo' },
                { path: '/location', label: 'Location' },
                { path: '/languages', label: 'Languages' },
                { path: '/passions', label: 'Passions' }
              ]},
              { step: 2, title: 'STEP 02: What we’re looking for', links: [
                { path: '/overview', label: 'Overview' },
                { path: '/expertise', label: 'Expertise' },
                { path: '/access', label: 'Access' },
                { path: '/connection', label: 'Connection' }
              ]},
              { step: 3, title: 'STEP 03: Your Idea', links: [
                { path: '/theme', label: 'Your theme' },
                { path: '/title', label: 'Title' },
                { path: '/', label: 'What we\'ll do' },
                { path: '/', label: 'What I\'ll provide' },
                { path: '/requirements', label: 'Guest requirements' },
                { path: '/localization', label: 'Localization' },
                { path: '/trip-photos', label: 'Photos' }
              ]},
              { step: 4, title: 'STEP 04: Contacts', links: [
                { path: '/group-size', label: 'Group size' },
                { path: '/availability', label: 'Availability' },
                { path: '/guest-pricing', label: 'Guest pricing' },
                { path: '/booking', label: 'Bookings' },
                { path: '/review', label: 'Review and Submit' }
              ]}
            ].map(({ step, title, links }) => (
              <li key={step}>
                <div
                  className={`mt-4 cursor-pointer px-6 ${selectedStep === step ? 'text-yellow-400 rounded font-semibold' : 'text-gray-400'}`}
                  onClick={() => handleStepClick(step)}
                >
                  {title}
                </div>
                {selectedStep === step && (
                  <ul className="">
                    {links.map(({ path, label }) => (
                      <li key={path}>
                        <Link to={path} className={getClass(path)}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;