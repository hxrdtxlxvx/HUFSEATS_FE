import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // 메뉴 클릭 시 자동으로 닫히게 하는 핸들러
  const handleMenuClick = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full h-12 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 h-12 relative">
        {/* 메뉴 버튼 */}
        <button
          className="text-3xl leading-none translate-y-[-4px]"
          aria-label="메뉴 열기"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-gray-800"
          style={{ textDecoration: "none" }}
        >
          HUFSEATS
        </Link>
        <div style={{ width: "2rem" }} />
        {/* 펼쳐지는 메뉴 - 헤더 아래에 오도록 absolute 배치 */}
        <div
          className={`absolute left-0 top-full w-full transition-all duration-300 overflow-hidden bg-white shadow-md rounded-b z-50 ${
            isOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <ul className="px-4 py-2 space-y-2">
            <li>
              <Link to="/" onClick={handleMenuClick}>
                🏠 홈
              </Link>
            </li>
            <li>
              <Link to="/map" onClick={handleMenuClick}>
                🗺️ 지도에서 보기
              </Link>
            </li>
            <li>
              <Link to="/list" onClick={handleMenuClick}>
                📋 전체 데이터 보기
              </Link>
            </li>
            <li>
              <Link to="/board" onClick={handleMenuClick}>
                📝 후기 게시판
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}