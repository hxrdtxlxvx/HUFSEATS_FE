import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Map() {
  // URL에서 restaurant 파라미터 가져오기
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedRestaurantName = params.get("restaurant");

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
        window.kakao.maps.load(loadMap);
      };
    } else {
      // 이미 script 태그가 있으면 onload만 다시 등록
      document.getElementById(scriptId).onload = () => {
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
          let selectedRestaurantMarker = null;
          let selectedRestaurantInfo = null;

          data.forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.lat, place.lng);
            const marker = new window.kakao.maps.Marker({ position });
            marker.setMap(map);

            bounds.extend(position);

            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `<div style="
                padding: 10px; 
                font-size: 14px; 
                text-align: center; 
                background-color: #e6f4ff; 
                border-radius: 8px; 
                width: 150px;
                margin: 0 auto;
                line-height: 1.5;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
              ">
                <strong style="display: block; margin-bottom: 4px;">${place.name}</strong>
                <span>${place.description || ""}</span>
              </div>
              `,
              removable: true
            });

            let infoOpen = false;
            window.kakao.maps.event.addListener(marker, "click", () => {
              if (infoOpen) {
                infoWindow.close();
              } else {
                infoWindow.open(map, marker);
              }
              infoOpen = !infoOpen;
            });

            // 선택된 식당과 일치하면 이 마커와 정보창을 저장
            if (selectedRestaurantName && place.name === selectedRestaurantName) {
              selectedRestaurantMarker = marker;
              selectedRestaurantInfo = infoWindow;
            }
          });

          // 모든 마커가 보이도록 지도 범위 자동 조절
          map.setBounds(bounds);

          // 선택된 식당이 있으면 지도 중앙에 표시하고 정보창 열기
          if (selectedRestaurantMarker && selectedRestaurantInfo) {
            setTimeout(() => {
              map.setCenter(selectedRestaurantMarker.getPosition());
              map.setLevel(2);  // 더 가까이 확대
              selectedRestaurantInfo.open(map, selectedRestaurantMarker);
            }, 500);
          }
        });
    }
  }, [selectedRestaurantName]);

  return (
    <div className="pt-14 px-4">
      <h2 className="text-lg font-bold mb-4 text-center">📍 지도에서 보기</h2>
      <div id="map" className="w-full h-[500px] rounded-md shadow border" />
    </div>
  );
}