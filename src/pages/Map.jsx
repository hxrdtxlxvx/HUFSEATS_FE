import { useEffect } from "react";

export default function Map() {
  useEffect(() => {
    // 이미 스크립트가 있으면 중복 삽입 방지
    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    console.log("🔄 Loading Kakao Maps SDK...");

    const scriptId = "kakao-map-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("✅ Kakao SDK loaded!");
        console.log(window.kakao);
        window.kakao.maps.load(loadMap);
      };
    } else {
      // 이미 script 태그가 있으면 onload만 다시 등록
      document.getElementById(scriptId).onload = () => {
        console.log("✅ Kakao SDK loaded!");
        console.log(window.kakao);
        window.kakao.maps.load(loadMap);
      };
    }

    function loadMap() {
      const container = document.getElementById("map");
      if (!container) return;
      const options = {
        center: new window.kakao.maps.LatLng(37.596833, 127.058521),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      // coordinates.json에서 여러 마커와 정보창 표시
      fetch("/coordinates.json")
        .then((res) => res.json())
        .then((data) => {
          const bounds = new window.kakao.maps.LatLngBounds();

          data.forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.lat, place.lng);
            const marker = new window.kakao.maps.Marker({ position });
            marker.setMap(map);

            bounds.extend(position);

            // InfoWindow 대신 CustomOverlay 사용
            const content = document.createElement("div");
            content.className = "custom-overlay";
            content.innerHTML = `
              <div style="
                padding: 8px;
                font-size: 13px;
                text-align: center;
                background-color: #e6f4ff;
                border-radius: 8px;
                width: auto; /* 텍스트에 맞게 자동 조절 */
                min-width: 50px; /* 최소 너비 */
                max-width: 200px; /* 최대 너비 */
                white-space: nowrap; /* 텍스트가 한 줄로 */
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                position: relative;
                cursor: pointer; /* 클릭 가능함을 표시 */
              ">
                <strong style="display: block; margin-bottom: 2px; font-size: 13px;">${place.name}</strong>
                <span style="font-size: 11px;">${place.description}</span>
              </div>
            `;

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: position,
              content: content,
              yAnchor: 1.3,  // 말풍선이 마커 위에 오도록 조정
            });

            // 말풍선 클릭 이벤트 추가
            content.addEventListener('click', () => {
              customOverlay.setMap(null);
              isOverlayOpen = false;
            });

            // 마커 클릭 이벤트
            let isOverlayOpen = false;
            window.kakao.maps.event.addListener(marker, "click", () => {
              if (isOverlayOpen) {
                customOverlay.setMap(null);  // 오버레이 제거로 닫기
              } else {
                customOverlay.setMap(map);   // 오버레이 맵에 추가로 열기
              }
              isOverlayOpen = !isOverlayOpen;
            });
          });

          // 모든 마커가 보이도록 지도 범위 자동 조절
          map.setBounds(bounds);
        });
    }
  }, []);

  return (
    <div className="pt-4 text-center px-4">
      <h2 className="text-lg font-bold mb-4">📍 지도에서 보기</h2>
      <div id="map" className="w-full h-[500px] rounded-md shadow border" />
    </div>
  );
}