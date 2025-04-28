import React from 'react';
import LeftSection from './LeftSection';
import MainFeed from './MainFeed';
import RightSection from './RightSection';

const FeedLayout = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <LeftSection />
      <MainFeed />
      <RightSection />
    </div>
  );
};

export default FeedLayout;
