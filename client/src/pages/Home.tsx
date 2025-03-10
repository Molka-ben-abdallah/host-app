import React, { useState ,useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import Input from '../components/Input';

const Home: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [nationality, setNationality] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formRef.current?.checkValidity()) {
      const formData = {
        firstName,
        lastName,
        birthday,
        nationality,
        email,
        mobile
      };

      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        const data = await response.json();
        console.log('Form submitted successfully:', data);
        const userId = data.profile._id; // Make sure you're using the correct path for _id
        console.log('user id:', userId);
        localStorage.setItem('userId', userId);
        window.location.reload();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      formRef.current?.reportValidity();
    }
  };

  return (
    <div>
      <MainLayout
        title="Profile Informations"
        tip="Guests want to know who’s hosting them. This must be your actual name, not the name of a business. Only your first name will appear on your page. If you have co-hosts, you'll be able to add them later."
        nextPage="/location"
      >
        <form className=" form"
           id="formId" ref={formRef}
           onSubmit={handleSubmit}
        >
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => handleChange(e, setFirstName)}
            placeholder="Enter your first name"
            required={true}
          />
          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => handleChange(e, setLastName)}
            placeholder="Enter your last name"
            required={true}
          />
          <Input
            label="Birthday"
            type="date"
            value={birthday}
            onChange={(e) => handleChange(e, setBirthday)}
            placeholder=""
            required={true}
          />
          <Input
            label="Nationality"
            type="text"
            value={nationality}
            onChange={(e) => handleChange(e, setNationality)}
            placeholder="Enter your nationality"
            required={true}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => handleChange(e, setEmail)}
            placeholder="Enter your email"
            required={true}
          />
          <Input
            label="Mobile"
            type="tel"
            value={mobile}
            onChange={(e) => handleChange(e, setMobile)}
            placeholder="Enter your mobile number"
            required={true}
          />
          
        </form>
      </MainLayout>
    </div>
  );
};

export default Home;
