// Map.js

// sets center according to nepal cooordinates
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import L1 from "leaflet.markercluster";

const Map = () => {
    const mapRef = useRef(null);
    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [28.3949, 84.124],
            zoom: 7,
            // minZoom:7,
            attributionControl: true,
            trackResize: false,
            scrollWheelZoom: false,
            tileSize: 512,
            layers: [
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }),
            ],
        });
    }, []);


    return (
        <>
            <div id="map" />
        </>
    );
};

export default Map;


// Plotting nepal geojson data with border

const Map1 = () => {
    const [nepal, setNepal] = useState({});
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const list = [
        {
            coord: [26.6726, 87.6792],
            id: 4,
            locationInfo: {
                province: "Province 1",
                district: "Jhapa",
                municipality: "Damak Nagarpalika",
            },
            ministry: {
                name: "Ministry of Industry, Tourism, Forest and Environment",
            },
            project_name_in_english: "Road extension 2022",
            region: "Damak Nagarpalika",
        },
    ];

    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [28.3949, 84.124],
            zoom: 7,
            // minZoom:7,
            attributionControl: true,
            trackResize: false,
            scrollWheelZoom: false,
            tileSize: 512,
            layers: [
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }),
            ],
        });
    }, []);

    useEffect(() => {
        fetch("/data/Nepal.json")
            .then((response) => response.json())
            .then((data) => setNepal(data));
    }, []);


    useEffect(() => {
        if (
            Object.keys(nepal).length
        )
            mapPlot();
    }, [list, nepal]);

    const mapPlot = () => {
        const latLngs = [];
        const coordinates = nepal.features[0].geometry.coordinates[0][0];

        for (let i = 0; i < coordinates.length; i++) {
            latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
        }

        if (layerRef.current === null && latLngs.length) {
        };
        L.geoJSON(nepal.features).addTo(mapRef.current);
    }


    return (
        <>
            <div id="map" />
        </>
    );
};

//  adding simple marker along with provinces districts and marker
const Map2 = () => {
    const [nepal, setNepal] = useState({});
    const [provinces, setProvinces] = useState({});
    const [districts, setDistricts] = useState({});
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const list = [
        {
            coord: [26.6726, 87.6792],
            id: 4,
            locationInfo: {
                province: "Province 1",
                district: "Jhapa",
                municipality: "Damak Nagarpalika",
            },
            ministry: {
                name: "Ministry of Industry, Tourism, Forest and Environment",
            },
            project_name_in_english: "Road extension 2022",
            region: "Damak Nagarpalika",
        },
    ];

    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [28.3949, 84.124],
            zoom: 7,
            // minZoom:7,
            attributionControl: true,
            trackResize: false,
            scrollWheelZoom: false,
            tileSize: 512,
            layers: [
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }),
            ],
        });
    }, []);

    useEffect(() => {
        fetch("/data/Nepal.json")
            .then((response) => response.json())
            .then((data) => setNepal(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalProvince.json')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalDistrict.json')
            .then((response) => response.json())
            .then((data) => setDistricts(data));
    }, []);


    useEffect(() => {
        if (Object.keys(nepal).length && Object.keys(provinces).length && Object.keys(districts).length)
            mapPlot(list);
    }, [list, nepal, provinces, districts]);

    const mapPlot = (data) => {
        const latLngs = [];
        const coordinates = nepal.features[0].geometry.coordinates[0][0];

        for (let i = 0; i < coordinates.length; i++) {
            latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
        }

        if (layerRef.current === null && latLngs.length) {
            const options = {
                style: {
                    color: '#2564de',
                    weight: 2,
                    opacity: 0.1,
                    fillColor: 'transparent',
                },
            };

            layerRef.current = L.geoJSON(nepal.features, options).addTo(mapRef.current);
            layerRef.current.addData(districts);
            layerRef.current = L.geoJSON(provinces.features, {
                style: { ...options.style, opacity: 0.3 },
                onEachFeature: () => 'hello',
            }).addTo(mapRef.current);

        }
        L.marker(data[0].coord).bindPopup('test').addTo(mapRef.current)
    }


    return (
        <>
            <div id="map" />
        </>
    );
};

// styling marker and adding custom icon
// import healthMarkerIcon from './health_institute_marker.svg';
// import educationMarkerIcon from './education_institute_marker.svg';

const Map3 = () => {
    const [nepal, setNepal] = useState({});
    const [provinces, setProvinces] = useState({});
    const [districts, setDistricts] = useState({});
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const list = [
        {
            coord: [26.6726, 87.6792],
            id: 1,
            project_name_in_english: "Education Data",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [27.6726, 87.6792],
            id: 2,
            project_name_in_english: "Health Data ",
            region: "Damak Nagarpalika",
            type: 'Health'
        },
    ];

    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [28.3949, 84.124],
            zoom: 7,
            // minZoom:7,
            attributionControl: true,
            trackResize: false,
            scrollWheelZoom: false,
            tileSize: 512,
            layers: [
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }),
            ],
        });
    }, []);

    useEffect(() => {
        fetch("/data/Nepal.json")
            .then((response) => response.json())
            .then((data) => setNepal(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalProvince.json')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalDistrict.json')
            .then((response) => response.json())
            .then((data) => setDistricts(data));
    }, []);


    useEffect(() => {
        if (Object.keys(nepal).length && Object.keys(provinces).length && Object.keys(districts).length)
            mapPlot(list);
    }, [list, nepal, provinces, districts]);

    const mapPlot = (data) => {
        const customIcon = L.icon({
            iconUrl: markerIcon,
            iconAnchor: [11, 41],
            popupAnchor: [0, -41],
        });

        const latLngs = [];
        const coordinates = nepal.features[0].geometry.coordinates[0][0];

        for (let i = 0; i < coordinates.length; i++) {
            latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
        }

        if (layerRef.current === null && latLngs.length) {
            const options = {
                style: {
                    color: '#2564de',
                    weight: 2,
                    opacity: 0.1,
                    fillColor: 'transparent',
                },
            };

            layerRef.current = L.geoJSON(nepal.features, options).addTo(mapRef.current);
            layerRef.current.addData(districts);
            layerRef.current = L.geoJSON(provinces.features, {
                style: { ...options.style, opacity: 0.3 },
                onEachFeature: () => 'hello',
            }).addTo(mapRef.current);

        }
        data.map((eachData) => (L.marker(eachData.coord, {
            icon: L.icon({
                iconUrl: eachData.type === 'Education' ? educationMarkerIcon : healthMarkerIcon,
                iconAnchor: [11, 41],
                popupAnchor: [0, -41],
            })
        }).bindPopup(
            `<div class="map-popup">
      <div class="title">
        ${`${eachData.project_name_in_english}`
            }
      </div>`
        ).addTo(mapRef.current)))

    }


    return (
        <>
            <div id="map" />
        </>
    );
};

// Marker cluster// add its css in index.html for styling.

// note: leaflet.markerCluster 1.5.1 verion not working with updated version of leaflet so i have used 1.4.1
const Map4 = () => {
    const [nepal, setNepal] = useState({});
    const [provinces, setProvinces] = useState({});
    const [districts, setDistricts] = useState({});
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const markerRef = useRef(null);
    const list = [
        {
            coord: [26.6726, 87.6792],
            id: 1,
            project_name_in_english: "Education Data",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [26.8, 87.6792],
            id: 2,
            project_name_in_english: "Education Data 2",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [26.7, 87.6792],
            id: 3,
            project_name_in_english: "Education Data 3",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [27.6726, 87.6792],
            id: 2,
            project_name_in_english: "Health Data ",
            region: "Damak Nagarpalika",
            type: 'Health'
        },
    ];

    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [28.3949, 84.124],
            zoom: 7,
            // minZoom:7,
            attributionControl: true,
            trackResize: false,
            scrollWheelZoom: false,
            tileSize: 512,
            layers: [
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }),
            ],
        });
    }, []);

    useEffect(() => {
        fetch("/data/Nepal.json")
            .then((response) => response.json())
            .then((data) => setNepal(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalProvince.json')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalDistrict.json')
            .then((response) => response.json())
            .then((data) => setDistricts(data));
    }, []);


    useEffect(() => {
        if (Object.keys(nepal).length && Object.keys(provinces).length && Object.keys(districts).length)
            mapPlot(list);
    }, [list, nepal, provinces, districts]);

    const mapPlot = (data) => {
        const customIcon = L.icon({
            iconUrl: markerIcon,
            iconAnchor: [11, 41],
            popupAnchor: [0, -41],
        });

        const latLngs = [];
        const coordinates = nepal.features[0].geometry.coordinates[0][0];

        for (let i = 0; i < coordinates.length; i++) {
            latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
        }

        if (layerRef.current === null && latLngs.length) {
            const options = {
                style: {
                    color: '#2564de',
                    weight: 2,
                    opacity: 0.1,
                    fillColor: 'transparent',
                },
            };

            layerRef.current = L.geoJSON(nepal.features, options).addTo(mapRef.current);
            layerRef.current.addData(districts);
            layerRef.current = L.geoJSON(provinces.features, {
                style: { ...options.style, opacity: 0.3 },
                onEachFeature: () => 'hello',
            }).addTo(mapRef.current);

        }
        if (markerRef.current) {
            markerRef.current.clearLayers();
        }
        markerRef.current = new L1.MarkerClusterGroup();

        const provinceMap = [];
        data.map((eachData) =>
            provinceMap.push(
                markerRef.current.addLayer(
                    (L.marker(eachData.coord, {
                        icon: L.icon({
                            iconUrl: eachData.type === 'Education' ? educationMarkerIcon : healthMarkerIcon,
                            iconAnchor: [11, 41],
                            popupAnchor: [0, -41],
                        })
                    }).bindPopup(
                        `<div class="map-popup">
              <div class="title">
                ${`${eachData.project_name_in_english}`
                        }
              </div>`
                    ))
                )
            )
        );

        const layerGroup = L.layerGroup(provinceMap);
        layerGroup.addTo(mapRef.current);

        mapRef.current.addLayer(markerRef.current);
    }


    return (
        <>
            <div id="map" />
        </>
    );
};


// Different plugins
// how i used this mask plugin
L.Mask = L.Polygon.extend({
    options: {
        stroke: true,
        color: '#7ca7f8',
        width: 1,
        opacity: 0.2,
        fillColor: '#2a2f38',
        fillOpacity: 1,
        clickable: true,
        outerBounds: new L.LatLngBounds([-90, -360], [90, 360]),
    },

    initialize: function (latLngs, options) {
        const outerBoundsLatLngs = [
            this.options.outerBounds.getSouthWest(),
            this.options.outerBounds.getNorthWest(),
            this.options.outerBounds.getNorthEast(),
            this.options.outerBounds.getSouthEast(),
        ];

        L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
    },
});

L.mask = function (latLngs, options) {
    return new L.Mask(latLngs, options);
};


const Map5 = () => {
    const [nepal, setNepal] = useState({});
    const [provinces, setProvinces] = useState({});
    const [districts, setDistricts] = useState({});
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const markerRef = useRef(null);
    const list = [
        {
            coord: [26.6726, 87.6792],
            id: 1,
            project_name_in_english: "Education Data",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [26.8, 87.6792],
            id: 2,
            project_name_in_english: "Education Data 2",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [26.7, 87.6792],
            id: 3,
            project_name_in_english: "Education Data 3",
            region: "Damak Nagarpalika",
            type: 'Education'
        },
        {
            coord: [27.6726, 87.6792],
            id: 2,
            project_name_in_english: "Health Data ",
            region: "Damak Nagarpalika",
            type: 'Health'
        },
    ];

    useEffect(() => {
        mapRef.current = L.map("map", {
            center: [28.3949, 84.124],
            zoom: 7,
            // minZoom:7,
            attributionControl: true,
            trackResize: false,
            scrollWheelZoom: false,
            tileSize: 512,
            layers: [
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }),
            ],
        });
    }, []);

    useEffect(() => {
        fetch("/data/Nepal.json")
            .then((response) => response.json())
            .then((data) => setNepal(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalProvince.json')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        fetch('/data/NewNepalDistrict.json')
            .then((response) => response.json())
            .then((data) => setDistricts(data));
    }, []);


    useEffect(() => {
        if (Object.keys(nepal).length && Object.keys(provinces).length && Object.keys(districts).length)
            mapPlot(list);
    }, [list, nepal, provinces, districts]);

    const mapPlot = (data) => {
        const customIcon = L.icon({
            iconUrl: markerIcon,
            iconAnchor: [11, 41],
            popupAnchor: [0, -41],
        });

        const latLngs = [];
        const coordinates = nepal.features[0].geometry.coordinates[0][0];

        for (let i = 0; i < coordinates.length; i++) {
            latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
        }

        if (layerRef.current === null && latLngs.length) {
            layerRef.current = L.mask(latLngs).addTo(mapRef.current);

            const options = {
                style: {
                    color: '#2564de',
                    weight: 2,
                    opacity: 0.1,
                    fillColor: 'transparent',
                },
            };

            layerRef.current = L.geoJSON(nepal.features, options).addTo(mapRef.current);
            layerRef.current.addData(districts);
            layerRef.current = L.geoJSON(provinces.features, {
                style: { ...options.style, opacity: 0.3 },
                onEachFeature: () => 'hello',
            }).addTo(mapRef.current);

        }
        if (markerRef.current) {
            markerRef.current.clearLayers();
        }
        markerRef.current = new L1.MarkerClusterGroup();

        const provinceMap = [];
        data.map((eachData) =>
            provinceMap.push(
                markerRef.current.addLayer(
                    (L.marker(eachData.coord, {
                        icon: L.icon({
                            iconUrl: eachData.type === 'Education' ? educationMarkerIcon : healthMarkerIcon,
                            iconAnchor: [11, 41],
                            popupAnchor: [0, -41],
                        })
                    }).bindPopup(
                        `<div class="map-popup">
              <div class="title">
                ${`${eachData.project_name_in_english}`
                        }
              </div>`
                    ))
                )
            )
        );

        const layerGroup = L.layerGroup(provinceMap);
        layerGroup.addTo(mapRef.current);

        mapRef.current.addLayer(markerRef.current);
    }


    return (
        <>
            <div id="map" />
        </>
    );
};


// master before commit 
// const mapPlot = (data) => {
//     const customIcon = L.icon({
//         iconUrl: markerIcon,
//         iconAnchor: [11, 41],
//         popupAnchor: [0, -41],
//     });

//     const latLngs = [];
//     const coordinates = nepal.features[0].geometry.coordinates[0][0];

//     for (let i = 0; i < coordinates.length; i++) {
//         latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
//     }

//     if (layerRef.current === null && latLngs.length) {
//         layerRef.current = L.mask(latLngs).addTo(mapRef.current);

//         const options = {
//             style: {
//                 color: '#2564de',
//                 weight: 2,
//                 opacity: 0.1,
//                 fillColor: 'transparent',
//             },
//         };

//         layerRef.current = L.geoJSON(nepal.features, options).addTo(mapRef.current);
//         layerRef.current.addData(districts);
//         layerRef.current = L.geoJSON(provinces.features, {
//             style: { ...options.style, opacity: 0.3 },
//             onEachFeature: () => 'hello',
//         }).addTo(mapRef.current);

//     }
//     if (markerRef.current) {
//         markerRef.current.clearLayers();
//     }
//     markerRef.current = new L1.MarkerClusterGroup();

//     const provinceMap = [];
//     data.map((eachData) =>
//         provinceMap.push(
//             markerRef.current.addLayer(
//                 (L.marker(eachData.coord, {
//                     icon: L.icon({
//                         iconUrl: eachData.type === 'Education' ? educationMarkerIcon : healthMarkerIcon,
//                         iconAnchor: [11, 41],
//                         popupAnchor: [0, -41],
//                     })
//                 }).bindPopup(
//                     `<div class="map-popup">
//         <div class="title">
//           ${`${eachData.project_name_in_english}`
//                     }
//         </div>`
//                 ))
//             )
//         )
//     );

//     const layerGroup = L.layerGroup(provinceMap);
//     layerGroup.addTo(mapRef.current);

//     mapRef.current.addLayer(markerRef.current);
// }







