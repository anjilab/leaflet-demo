import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Map from './Map'
import ShapeMap from './ShapeFileMap'
import './App.css'


export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/map">Basic Map</Link>
            </li>
            <li>
              <Link to="/geojson/map">Geojson map</Link>
            </li>
            <li>
              <Link to="/district/map">Geojson district map</Link>
            </li>
            <li>
              <Link to="/shapefile/map">Shapefile map</Link>
            </li>
            <li>
              <Link to="/marker/map">Marker in map</Link>
            </li>
            <li>
              <Link to="/custom-marker/map">Custom Marker in map</Link>
            </li>
            <li>
              <Link to="/marker-cluster/map">Marker Cluster in map</Link>
            </li>
            <li>
              <Link to="/plugin/map">Leaflet plugin</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/map">
            <Map type="simple" />
          </Route>
          <Route path="/geojson/map">
            <Map type="geojson" />
          </Route>
          <Route path="/district/map">
            <Map type="district-geojson" />
          </Route>
          <Route path="/shapefile/map">
            <ShapeMap />
          </Route>
          <Route path="/marker/map">
            <Map type="simplemarker" />
          </Route>
          <Route path="/custom-marker/map">
            <Map type="custommarker" />
          </Route>
          <Route path="/marker-cluster/map">
            <Map type="clustermarker" />
          </Route>
          <Route path="/plugin/map">
            <Map type="plugin" />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

