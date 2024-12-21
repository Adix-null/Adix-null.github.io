const map = L.map("map").setView([54.68714, 25.279572], 10);

//base map
L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    }
).addTo(map);

const markers = {};

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

function fetchAndUpdateData() {
    fetch('https://www.stops.lt/vilnius/gps_full.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').filter(line => line.trim() !== '');

            lines.forEach(line => {
                const [name, lat, lng, info] = line.split(',');

                const coords = [parseFloat(lat), parseFloat(lng)];

                //change generated code
                if (markers[name]) {
                    markers[name].setPopupContent(`
                        <h3>${name}</h3>
                        <p>${info}</p>
                    `);
                } else {
                    const marker = L.circleMarker(coords, {
                        radius: 8,
                        color: '#3388ff',
                        fillColor: '#3388ff',
                        fillOpacity: 0.7
                    }).addTo(map);

                    marker.bindPopup(`
                        <h3>${name}</h3>
                        <p>${info}</p>
                    `);

                    markers[name] = marker;
                }
            });
        })
        .catch(err => console.error("Error fetching data:", err));
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

