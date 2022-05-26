import React from 'react';

const DataCard = ({bgColor, number, title, icon}) => {
  return (
    <div className={`relative w-full h-[150px] rounded-[20px] bg-white p-6`}>
      <div className="absolute width-[40px] height-[40px] top-[10px] right-[12px] p-1 rounded-[50%] bg-purple-100 z-10 flex items-center">
        {icon}
      </div>
      <h3 className="font-bold text-3xl mt-2 mb-4 text-purple-600">{number}</h3>
      <h4 className="font-medium text-xl text-purple-600">{title}</h4>
    </div>
  );
}

export default DataCard;
