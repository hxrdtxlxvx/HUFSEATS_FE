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

            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:8px; font-size:14px;">${place.name}<br/>${place.description}</div>`,
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
          });

          // 모든 마커가 보이도록 지도 범위 자동 조절
          map.setBounds(bounds);
        });
    }
  }, []);

  return (
    <div className="pt-10 px-4">
      <h2 className="text-lg font-bold mb-4">📍 지도에서 보기</h2>
      <div id="map" className="w-full h-[500px] rounded-md shadow border" />
    </div>
  );
}