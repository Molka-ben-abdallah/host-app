import React, { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import Input from '../components/Input';

const Passions = () => {
  const [passions, setPassions] = useState('');
  const [cityTrait, setCityTrait] = useState('');
  const [description, setDescription] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  
      // Log userId to ensure it is being fetched correctly
      useEffect(() => {
          const userId = localStorage.getItem('userId');
          console.log('User ID retrieved from localStorage in passion:', userId);
  
          if (!userId) {
              console.error("User ID is not available.");
              return; 
          }
      }, []); // Empty dependency array ensures it runs only once when the component mounts
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
          setInput(e.target.value);
      };
  
      const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          
          if (formRef.current?.checkValidity()) {
              const passionData = {
                passions: passions,
                description: description,
                cityTrait: cityTrait,
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
        nextPage="/profile-information"
      >
        <div className='flex justify-center'>
        <form className="w-full max-w-4xl grid grid-cols-1 my-5 px-4 sm:px-0"
           id="formId" ref={formRef}
           onSubmit={handleSubmit}
        >
            <Input 
              label='what are you passionate about ?'
              type='text'
              value={passions}
              onChange={(e) => handleChange(e, setPassions)}
              placeholder=''
              required={true}
            />
            <Input 
                label='what do you love most about your city ?'
                type='text'
                value={cityTrait}
                onChange={(e) => handleChange(e, setCityTrait)}
                placeholder=''
                required={true}
            />
            
            <div className='px-8'>
                <label htmlFor="description" className='block text-gray-700 font-primaryRegular'>Describe yourself more:</label>
                <textarea className='w-full font-primaryRegular justify-center w-100 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFAF20]'
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    cols={20}
                    placeholder=""
                    required
                />
            </div>
          </form>
        </div>
        </MainLayout>
    </div>
  )
}

export default Passions