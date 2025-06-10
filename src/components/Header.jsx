export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <button className="text-3xl leading-none translate-y-[-4px]" aria-label="메뉴 열기">☰</button>
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-gray-800">
        HUFSEATS
      </h1>
      <div style={{ width: "2rem" }} /> {/* 오른쪽 공간 확보용 */}
    </header>
  );
}