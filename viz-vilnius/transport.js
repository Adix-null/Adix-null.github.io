const map = L.map("map").setView([54.68714, 25.279572], 11);

//base map
L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    }
).addTo(map);

markersOld = [];
markersNew = [];
markerPairs = [];
firstPairs = [];
const markerGroup = L.layerGroup().addTo(map);

//Lithuanian characters are encoded in some weird Windows-1257 format, so this is a fallback if conversion fails
const encodings = [
    ["ą", "ؤ…"],
    ["č", "ؤچ"],
    ["ę", "ؤ™"],
    ["ė", "ؤ—"],
    ["į", "ؤ¯"],
    ["š", "إ،"],
    ["ų", "إ³"],
    ["ū", "إ«"],
    ["ž", "إ¾"],
    ["Ą", "ؤ„"],
    ["Č", "ؤŒ"],
    ["Ę", "ؤک"],
    ["Ė", "ؤ–"],
    ["Į", "ؤ®"],
    ["Š", "إ "],
    ["Ų", "إ²"],
    ["Ū", "إھ"],
    ["Ž", "إ½"]
];

//oficialios spalvos
const Colors = Object.freeze({
    RED: "#dc3131",
    GREEN: "#008000",
    BLUE: "#0073ac",
    BLACK: "#303030"
});

function fetchAndUpdateData() {
    fetch('https://www.stops.lt/vilnius/gps_full.txt')
        .then(response => response.text())
        .then(data => {
            markerPairs = createMarkerPairs(firstPairs, markersNew);

            markerPairs.forEach(pair => {
                //if (pair.old.marker.getLatLng().lat !== pair.new.marker.getLatLng().lat || pair.old.marker.getLatLng().lng !== pair.new.marker.getLatLng().lng) {
                moveMarkerSmoothly(pair.old, pair.new.marker.getLatLng(), 1500);
                //console.log(pair);
                //}
            });
            markersOld = markersNew;
            markersNew = [];

            const zoomLevel = map.getZoom();
            const lines = data.split('\n').filter(line => line.trim() !== '');
            lines.shift();

            lines.forEach(line => {
                const [Transportas, Marsrutas, ReisoID, MasinosNumeris, Ilguma, Platuma, Greitis, Azimutas, ReisoPradziaMinutemis, NuokrypisSekundemis, MatavimoLaikas, MasinosTipas, KryptiesTipas, KryptiesPavadinimas, ReisoIdGTFS] = line.split(',');

                //put . after first 2 numbers
                const result_lat = parseFloat(Platuma.slice(0, 2) + '.' + Platuma.slice(2));
                const result_lon = parseFloat(Ilguma.slice(0, 2) + '.' + Ilguma.slice(2));
                const coords = [result_lat, result_lon];

                //choose color
                markerColor = "#ffffff";
                if (Marsrutas.slice(-1) == "G")
                    markerColor = Colors.GREEN;
                else if (Marsrutas.slice(-1) == "N")
                    markerColor = Colors.BLACK;
                else if (Transportas == "Autobusai")
                    markerColor = Colors.BLUE;
                else
                    markerColor = Colors.RED;

                var marker = L.circleMarker(coords, {
                    radius: 4,
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: 1,
                });
                markersNew.push({ marker: marker, busID: MasinosNumeris });

                let fallbackKryptiesPavadinimas = KryptiesPavadinimas
                encodings.forEach(entry => {
                    fallbackKryptiesPavadinimas = fallbackKryptiesPavadinimas.replaceAll(entry[1], entry[0]);
                });

                dictionary = [
                    ["name", Marsrutas],
                    ["info", MasinosNumeris],
                    ["info2", fallbackKryptiesPavadinimas]
                ]
                createPopup(marker, dictionary);
            });

            if (markersOld.length == 0) {
                firstPairs = markersNew;
                markersOld = markersNew;
                markersNew.forEach(marker => {
                    markerGroup.addLayer(marker.marker);
                });

            }
        })
        .catch(err => console.error("Error fetching data:", err));
}

function createPopup(marker, dictionary) {
    fetch('popup.html')
        .then(response => response.text())
        .then(template => {
            dictionary.forEach(entry =>
                template = template.replace("{" + entry[0] + "}", entry[1])
            );
            marker.bindPopup(template);
        })
        .catch(err => console.error("Error loading popup:", err));
}

function createMarkerPairs(markersOld, markersNew) {
    const pairs = [];

    markersNew.forEach(newMarker => {
        let matchingOldMarker = null;
        matchingOldMarker = markersOld.find(oldMarker => oldMarker.busID === newMarker.busID);
        matchingOldMarker ||= newMarker;
        pairs.push({ old: matchingOldMarker, new: newMarker });
    });

    return pairs;
}

function moveMarkerSmoothly(marker, targetLatLng, duration) {
    const startLatLng = marker.marker.getLatLng();
    const startTime = performance.now();

    function animate(time) {
        const elapsedTime = time - startTime;
        const t = Math.min(elapsedTime / duration, 1);

        const currentLat = startLatLng.lat + t * (targetLatLng.lat - startLatLng.lat);
        const currentLng = startLatLng.lng + t * (targetLatLng.lng - startLatLng.lng);

        marker.marker.setLatLng([currentLat, currentLng]);

        //Continue animation if not yet complete
        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

//Fetch data every 5 seconds
fetchAndUpdateData();
setInterval(fetchAndUpdateData, 5000);

document
    .getElementById("transport-type-select")
    .addEventListener("change", function () {
        const region = this.value;
        console.log("Selected:", region);
    });

