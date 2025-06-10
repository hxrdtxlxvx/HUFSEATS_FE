import React, { useState, useEffect } from "react";

const locationList = ["정문", "후문", "회기"];
const menuList = ["한식", "중식", "일식", "양식", "분식", "기타"];

const Roulette = () => {
  const [data, setData] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [result, setResult] = useState("");

  // list.txt 불러오기
  useEffect(() => {
  fetch("/list.txt")
    .then((res) => res.text())
    .then((text) => {
      const parsed = text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const parts = line.split("-");
          const name = parts[0]?.trim() || "";
          const location = parts[1]?.trim() || "";
          const menu = parts[2]?.trim() || "";
          const note = parts[3]?.trim(); 
          return { name, location, menu, note };
        });
      setData(parsed); // 여기서 상태 업데이트!
    });
}, []);

  // 체크박스 핸들러
  const handleLocation = (e) => {
    const { value, checked } = e.target;
    setSelectedLocations((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };
  const handleMenu = (e) => {
    const { value, checked } = e.target;
    setSelectedMenus((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  // 룰렛 돌리기
  const handleSpin = () => {
    const filtered = data.filter(
      (item) =>
        selectedLocations.includes(item.location) &&
        selectedMenus.includes(item.menu)
    );
    if (filtered.length > 0) {
      const randomPick = filtered[Math.floor(Math.random() * filtered.length)];
      setResult(
  randomPick.name +
    (randomPick.note ? ` (${randomPick.note})` : "")
);
    } else {
      setResult("범위와 메뉴를 선택해 주세요.");
    }
  };

  return (
    <div className="mx-auto w-11/12 max-w-md mt-4 p-4 rounded-xl border border-gray-300 shadow-md bg-white space-y-6">
      {/* 범위 선택 */}
      <fieldset className="border border-gray-300 rounded p-3">
        <legend className="mx-auto px-1 bg-white text-sm font-semibold text-gray-600 text-center">
          범위
        </legend>
        <div className="flex flex-col items-center space-y-2 text-gray-700">
          {locationList.map((loc) => (
            <label key={loc}>
              <input
                type="checkbox"
                value={loc}
                checked={selectedLocations.includes(loc)}
                onChange={handleLocation}
              />{" "}
              {loc}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 메뉴 선택 */}
      <fieldset className="border border-gray-300 rounded p-3">
        <legend className="mx-auto px-1 bg-white text-sm font-semibold text-gray-600 text-center">
          메뉴
        </legend>
        <div className="flex flex-col items-center space-y-2 text-gray-700">
          {menuList.map((menu) => (
            <label key={menu}>
              <input
                type="checkbox"
                value={menu}
                checked={selectedMenus.includes(menu)}
                onChange={handleMenu}
              />{" "}
              {menu}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 룰렛 돌리기 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleSpin}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          룰렛 돌리기
        </button>
      </div>

      {/* 결과창 */}
      <div className="border-t border-gray-300 pt-3 text-center min-h-[2.5rem]">
        <p className="text-sm text-gray-500">결과</p>
        <p className="text-l font-semibold text-gray-800 mt-1">{result || "-"}</p>
      </div>
    </div>
  );
};

export default Roulette;