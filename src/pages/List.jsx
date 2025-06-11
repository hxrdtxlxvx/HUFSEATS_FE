import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const navigate = useNavigate();
  
  const locationList = ["정문", "후문", "회기"];
  const menuList = ["한식", "중식", "일식", "양식", "분식", "기타"];

  useEffect(() => {
    // list.txt 데이터 로드
    fetch("/list.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsed = text
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line) => {
            const [name, location, menu, ...noteArr] = line.split("-");
            return {
              name: name?.trim() || "",
              location: location?.trim() || "",
              menu: menu?.trim() || "",
              note: noteArr.length > 0 ? noteArr.join("-").trim() : "",
            };
          });
        setData(parsed);
        setFilteredData(parsed);
      });
  }, []);

  // 필터링 적용
  useEffect(() => {
    if (selectedLocations.length === 0 && selectedMenus.length === 0) {
      // 아무 필터도 선택되지 않았으면 전체 데이터 보여주기
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      // 위치 필터
      const locationMatch = 
        selectedLocations.length === 0 || selectedLocations.includes(item.location);
      
      // 메뉴 필터
      const menuMatch = 
        selectedMenus.length === 0 || selectedMenus.includes(item.menu);
      
      return locationMatch && menuMatch;
    });

    setFilteredData(filtered);
  }, [data, selectedLocations, selectedMenus]);

  // 체크박스 핸들러 - 위치
  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    setSelectedLocations((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  // 체크박스 핸들러 - 메뉴
  const handleMenuChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMenus((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  // 식당 클릭 처리 - 지도로 이동
  const handleRestaurantClick = (restaurantName) => {
    navigate(`/map?restaurant=${encodeURIComponent(restaurantName)}`);
  };

  return (
    <div className="pt-4 px-4">
      <h2 className="text-lg font-bold mb-4 text-center">📋 전체 데이터 보기</h2>
      
      <div className="mb-6 flex flex-col gap-4 max-w-md mx-auto">
        {/* 필터 영역 */}
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold text-gray-600 mb-2">범위</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {locationList.map((location) => (
                <label 
                  key={location} 
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="location"
                    value={location}
                    checked={selectedLocations.includes(location)}
                    onChange={handleLocationChange}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">{location}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600 mb-2">메뉴</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {menuList.map((menu) => (
                <label 
                  key={menu} 
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="menu"
                    value={menu}
                    checked={selectedMenus.includes(menu)}
                    onChange={handleMenuChange}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">{menu}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 목록 */}
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-2 text-center">
            검색 결과: {filteredData.length}개
          </p>
          <ul className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <li key={index} className="py-3 text-center">
                {/* 클릭 가능한 제목 */}
                <div className="inline-block relative group"> {/* inline-block으로 변경하여 내용 크기만큼만 영역 차지 */}
                  <span
                    className="cursor-pointer font-medium hover:text-blue-600 transition-colors"
                    onClick={() => handleRestaurantClick(item.name)}
                  >
                    {item.name}
                  </span>
                  
                  {/* 툴팁 - 호버 시 표시되는 안내 */}
                  <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    지도에서 보기
                  </span>
                </div>
                
                <div className="flex gap-2 text-sm mt-1 justify-center">
                  {/* 위치에 따른 색상 차별화 */}
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.location === "정문" 
                      ? "bg-blue-100 text-blue-800" 
                      : item.location === "후문"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}>
                    {item.location}
                  </span>
                  {/* 메뉴 종류 태그 */}
                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                    {item.menu}
                  </span>
                </div>
                {item.note && (
                  <div className="text-sm text-gray-600 mt-1">{item.note}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default List;