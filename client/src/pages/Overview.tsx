import React from 'react'
import MainLayout from '../layouts/MainLayout'

const Overview = () => {
  return (
    <div>
      <MainLayout title='what we are looking for' nextPage='/experience' >
        <div className="flex justify-center">
        <div className="w-full max-w-4xl p-4 ">
          <h1 className="font-primaryBold text-3xl text-[#686868] my-5">what we are looking for</h1>
          
            <p className="my-10 font-primaryRegular inline-block ">
              Experience hosts are passionate locals who can make people feel at home while they’re trying something new. They must meet these standards:
            </p>
            <div className='my-10  text-center'>
            <ul className="space-y-2 font-primaryRegular inline-block text-left ">
                <li><span className="font-primaryBold text-sky-900">Expertise:</span> Having exceptional skill, ability, or background</li>
                <li><span className="font-primaryBold text-sky-900">Access:</span> Giving guests something they couldn’t do on their own</li>
                <li><span className="font-primaryBold text-sky-900">Connection:</span> Making meaningful interactions happen</li>
            </ul>
          </div>
            <p className="mt-4 font-primaryRegular inline-block">
                Let’s go over them together in more detail.
            </p>
          
        </div>
      </div>
      </MainLayout>
    </div>
  )
}

export default Overview