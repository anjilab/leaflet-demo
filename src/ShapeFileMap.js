import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import shp from 'shpjs';

/* global cw, shp */
L.Shapefile = L.GeoJSON.extend({
  options: {
    importUrl: 'shp.js',
  },

  initialize: function (file, options) {
    L.Util.setOptions(this, options);
    if (typeof cw !== 'undefined') {
      /*eslint-disable no-new-func*/
      if (!options.isArrayBuffer) {
        this.worker = cw(
          new Function(
            'data',
            'cb',
            'importScripts("' + this.options.importUrl + '");shp(data).then(cb);'
          )
        );
      } else {
        this.worker = cw(
          new Function(
            'data',
            'importScripts("' +
            this.options.importUrl +
            '"); return shp.parseZip(data);'
          )
        );
      }
      /*eslint-enable no-new-func*/
    }
    L.GeoJSON.prototype.initialize.call(
      this,
      {
        features: [],
      },
      options
    );
    this.addFileData(file);
  },

  addFileData: function (file) {
    var self = this;
    this.fire('data:loading');
    if (typeof file !== 'string' && !('byteLength' in file)) {
      var data = this.addData(file);
      this.fire('data:loaded');
      return data;
    }
    if (!this.worker) {
      shp(file)
        .then(function (data) {
          self.addData(data);
          self.fire('data:loaded');
        })
        .catch(function (err) {
          self.fire('data:error', err);
        });
      return this;
    }
    var promise;
    if (this.options.isArrayBufer) {
      promise = this.worker.data(file, [file]);
    } else {
      promise = this.worker.data(cw.makeUrl(file));
    }

    promise
      .then(function (data) {
        self.addData(data);
        self.fire('data:loaded');
        self.worker.close();
      })
      .then(
        function () { },
        function (err) {
          self.fire('data:error', err);
        }
      );
    return this;
  },
});

L.shapefile = function (a, b, c) {
  return new L.Shapefile(a, b, c);
};


const ShapeFileMap = () => {
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const markerRef = useRef(null);
  const [shapeData, setShapeData] = useState(null);

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
  }, []);

  useEffect(() => {
    fetch('/data/udaypur.zip')
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then((buffer) => setShapeData(buffer));
  }, []);




  useEffect(() => {
    if (shapeData)
      mapPlot(list);
  }, [list, shapeData]);

  const mapPlot = (data) => {
    if (layerRef.current === null) {
      L.shapefile(shapeData).addTo(mapRef.current);

    }
    if (markerRef.current) {
      markerRef.current.clearLayers();
    }
  }


  return (
    <>
      <div id="map" />
    </>
  );
};

export default ShapeFileMap;
