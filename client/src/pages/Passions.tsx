import React, { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import Input from '../components/Input';

const Passions = () => {
  const [interest, setInterest] = useState('');
  const [cityFavorite, setCityFavorite] = useState('');
  const [description, setDescription] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  
      // Log userId to ensure it is being fetched correctly
      useEffect(() => {
          const userId = localStorage.getItem('userId');
          console.log('User ID retrieved from localStorage in Location:', userId);
  
          if (!userId) {
              console.error("User ID is not available.");
              return; // Prevent API call if no userId
          }
      }, []); // Empty dependency array ensures it runs only once when the component mounts
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
          setInput(e.target.value);
      };
  
      const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          
          if (formRef.current?.checkValidity()) {
              const passionData = {
                  
              };            
  
              console.log('passion data:', passionData);
  
              try {
                  const userId = localStorage.getItem('userId');
                  const response = await fetch(`http://localhost:5000/api/profile/${userId}/passion`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(passionData),
                  });
                  console.log(`Sending PATCH request to: http://localhost:5000/api/profile/${userId}/passion`);
                  
          
                  if (!response.ok) {
                      throw new Error('Failed to update location');
                  }
  
                  const data = await response.json();
                  console.log('Location updated successfully:', data);
              } catch (error) {
                  console.error('Error updating location:', error);
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
        <form className="flex flex-col items-center"
           id="formId" ref={formRef}
           onSubmit={handleSubmit}
        >
            <Input 
              label='what are you passionate about ?'
              type='text'
              value={interest}
              onChange={(e) => handleChange(e, setInterest)}
              placeholder=''
              required={true}
            />
            <Input 
                label='what do you love most about your city ?'
                type='text'
                value={cityFavorite}
                onChange={(e) => handleChange(e, setCityFavorite)}
                placeholder=''
                required={true}
            />
            <label htmlFor="description" className='block text-gray-700 font-primaryRegular'>Describe yourself more:</label>
            <textarea className='w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:border-[#FFAF20] focus:ring-1 focus:ring-[#FFAF20] transition-all outline-none resize-none my-2'
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                cols={50}
                placeholder=""
                required
            />
          </form>
        </MainLayout>
    </div>
  )
}

export default Passions