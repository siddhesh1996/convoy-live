import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import type { PositionsMap } from "../types/position";
import "./ConvoyMap.css";

const DEFAULT_CENTER: LatLngExpression = [19.12, 72.9];
const DEFAULT_ZOOM = 13;

const USER_COLORS: Record<string, string> = {
  "user-1": "#2563eb",
  "user-2": "#16a34a",
  "user-3": "#ea580c",
  "user-4": "#9333ea",
};

function colorForUser(userId: string, index: number): string {
  return (
    USER_COLORS[userId] ??
    ["#dc2626", "#0891b2", "#ca8a04"][index % 3]
  );
}

function FitBounds({ positions }: { positions: PositionsMap }) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = Object.values(positions).map((p) => [
      p.latitude,
      p.longitude,
    ]);

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 16 });
  }, [positions, map]);

  return null;
}

interface ConvoyMapProps {
  positions: PositionsMap;
  currentUserId?: string;
  height?: string;
}

export default function ConvoyMap({
  positions,
  currentUserId,
  height = "420px",
}: ConvoyMapProps) {
  const entries = Object.entries(positions);
  const polylinePoints: LatLngExpression[] = entries.map(([, pos]) => [
    pos.latitude,
    pos.longitude,
  ]);

  return (
    <div className="convoy-map-wrapper">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="convoy-map"
        style={{ height }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds positions={positions} />

        {entries.length >= 2 && (
          <Polyline
            positions={polylinePoints}
            pathOptions={{
              color: "#6366f1",
              weight: 3,
              opacity: 0.7,
              dashArray: "8 6",
            }}
          />
        )}

        {entries.map(([userId, pos], index) => {
          const color = colorForUser(userId, index);
          const isCurrentUser = userId === currentUserId;
          const center: LatLngExpression = [pos.latitude, pos.longitude];

          return (
            <React.Fragment key={userId}>
              {pos.accuracy > 0 && (
                <Circle
                  center={center}
                  radius={pos.accuracy}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.08,
                    weight: 1,
                    opacity: 0.5,
                  }}
                />
              )}
              <Marker
                position={center}
                icon={L.divIcon({
                  className: "convoy-marker-icon",
                  html: `<span class="convoy-marker-dot" style="background:${color};${isCurrentUser ? "box-shadow:0 0 0 3px #fff,0 0 0 5px " + color + ";" : ""}"></span>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
              >
                <Popup>
                  <strong>{userId}</strong>
                  {isCurrentUser && " (you)"}
                  <br />
                  {pos.latitude.toFixed(5)}, {pos.longitude.toFixed(5)}
                  <br />
                  Accuracy: ±{Math.round(pos.accuracy)} m
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {entries.length > 0 && (
        <ul className="convoy-map-legend" aria-label="Map legend">
          {entries.map(([userId], index) => (
            <li key={userId}>
              <span
                className="convoy-legend-swatch"
                style={{ background: colorForUser(userId, index) }}
              />
              {userId}
              {userId === currentUserId && " (you)"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
