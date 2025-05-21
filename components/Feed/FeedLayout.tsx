import React from 'react';
import LeftSection from './LeftSection';
import MainFeed from './MainFeed';
import RightSection from './RightSection';

const FeedLayout = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className='hidden md:block w-1/4'>
        <LeftSection />
      </div>
      <div className='flex-1'>
        <MainFeed />
      </div>
      <div className='hidden md:block w-1/4'>
        <RightSection />
      </div>
    </div>
  );
};

export default FeedLayout;

