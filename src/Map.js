import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import L1 from "leaflet.markercluster";

import markerIcon from './marker.svg';
import healthMarkerIcon from './health_institute_marker.svg';
import educationMarkerIcon from './education_institute_marker.svg';

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


const Map = ({ type }) => {
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
            project_name_in_english: "Education Data 23",
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
            project_name_in_english: "Health Data testingggggrrr",
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
        return (() => {
            mapRef.current.remove();
            mapRef.current = null;
            layerRef.current = null;
            markerRef.current = null;
        })
    }, [type]);

    useEffect(() => {
        fetch("/data/Nepal.json")
            .then((response) => response.json())
            .then((data) => setNepal(data));

    }, [type]);

    useEffect(() => {
        fetch('/data/NewNepalProvince.json')
            .then((response) => response.json())
            .then((data) => setProvinces(data));

    }, [type]);

    useEffect(() => {
        fetch('/data/NewNepalDistrict.json')
            .then((response) => response.json())
            .then((data) => setDistricts(data));

    }, [type]);


    useEffect(() => {
        if (Object.keys(nepal).length && Object.keys(provinces).length && Object.keys(districts).length) {
            type === 'geojson' ? mapPlotGeojson()
                : type === 'simplemarker' ? mapPlotSimpleMarker(list)
                    : type === 'custommarker' ? mapPlotCustomMarker(list)
                        : type === 'clustermarker' ? mapPlotMarkerCluster(list)
                            : type === 'plugin' ? mapPlotPlugin(list)
                                : initialMap()

        }
    }, [list, nepal, provinces, districts, type]);


    const initialMap = () => { }

    const mapPlotGeojson = () => {
        const latLngs = [];
        const coordinates = nepal.features[0].geometry.coordinates[0][0];

        for (let i = 0; i < coordinates.length; i++) {
            latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
        }

        if (layerRef.current === null && latLngs.length) {
            layerRef.current = L.geoJSON(nepal.features).addTo(mapRef.current);
        }
    }

    const mapPlotSimpleMarker = (data) => {
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

    const mapPlotCustomMarker = (data) => {
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

    const mapPlotMarkerCluster = (data) => {
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
        let provinceMap = data.map((eachData) =>
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
        );
        const layerGroup = L.layerGroup(provinceMap);
        layerGroup.addTo(mapRef.current);
        mapRef.current.addLayer(markerRef.current);
    }

    const mapPlotPlugin = (data) => {
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

export default Map;
