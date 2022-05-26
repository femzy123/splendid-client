import React from 'react';

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className="loader-wrapper">
        <div className="loader">
          <div className="loader loader-inner"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
