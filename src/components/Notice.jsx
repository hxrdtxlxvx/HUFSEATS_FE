import React from "react";

const Notice = () => {
  return (
    <div className="mx-auto w-11/12 max-w-md mt-4 p-4 rounded-xl border border-gray-300 shadow-md bg-white">
      <h3 className="text-center font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-2">
        알림
      </h3>
      <div className="text-sm mt-3 text-gray-600 space-y-2">
        <p>마지막 수정: 25.08.15</p>
        <p>직접 가 본 곳 위주로 작성했습니다.</p>
      </div>
    </div>
  );
};

export default Notice;