// src/components/DataComponent.tsx
import React, { useState, useEffect } from "react";
import {
  ref,
  set,
  onValue,
  off,
  update,
  DataSnapshot,
} from "firebase/database";
import { database } from "./firebase";
import type { PairDistance, PositionsMap } from "./types/position";
import { computePairDistances, distancesFromMe } from "./utility/pairDistances";
import ConvoyMap from "./components/ConvoyMap";

interface Message {
  id: string;
  text: string;
  timestamp: number;
}

const CURRENT_USER_ID = "user-1";
const MAX_ACCURACY_METERS = 100;

const DataComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [errorPosition, setErrorPosition] =
    useState<GeolocationPositionError | null>(null);

  const [positions, setPositions] = useState<PositionsMap>({});
  const [pairDistances, setPairDistances] = useState<PairDistance[]>([]);
  const [distancesFromCurrentUser, setDistancesFromCurrentUser] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const messagesRef = ref(database, "messages");

    const unsubscribe = onValue(
      messagesRef,
      (snapshot: DataSnapshot) => {
        setIsLoading(false);
        setError(null);
        const data = snapshot.val();
        if (data) {
          const loadedMessages: Message[] = Object.keys(data).map((key) => ({
            id: key,
            text: data[key].text,
            timestamp: data[key].timestamp,
          }));
          setMessages(loadedMessages.sort((a, b) => a.timestamp - b.timestamp));
        } else {
          setMessages([]);
        }
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
        console.error("Error fetching messages:", err);
      },
    );

    return () => {
      off(messagesRef, "value", unsubscribe);
    };
  }, []);

  useEffect(() => {
    const positionsRef = ref(database, "positions");

    const unsubscribe = onValue(positionsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val() as PositionsMap | null;
      if (!data) {
        setPositions({});
        setPairDistances([]);
        setDistancesFromCurrentUser({});
        return;
      }

      setPositions(data);
      setPairDistances(computePairDistances(data));
      setDistancesFromCurrentUser(distancesFromMe(CURRENT_USER_ID, data));
    });

    return () => {
      off(positionsRef, "value", unsubscribe);
    };
  }, []);

  useEffect(() => {
    function onSuccessWatchPosition(pos: GeolocationPosition) {
      setPosition(pos);
    }

    function onErrorWatchPosition(err: GeolocationPositionError) {
      console.log(err, "==== errr =====");
      setErrorPosition(err);
    }

    const watchId = navigator.geolocation.watchPosition(
      onSuccessWatchPosition,
      onErrorWatchPosition,
      {
        enableHighAccuracy: true,
        // maximumAge: 0,
        // timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!position) return;

      set(ref(database, `positions/${CURRENT_USER_ID}`), {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now(),
      });

      // Simulated second user for local testing
      set(ref(database, "positions/user-2"), {
        latitude: 19.1181,
        longitude: 72.8791,
        accuracy: 50,
        timestamp: Date.now(),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [position?.coords.latitude, position?.coords.longitude]);

  const writeNewMessage = async () => {
    if (!newMessageText.trim()) return;

    try {
      const messageId = Date.now().toString();
      const messageRef = ref(database, `messages/${messageId}`);
      await set(messageRef, {
        text: newMessageText,
        timestamp: Date.now(),
      });
      setNewMessageText("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error writing message:", err);
    }
  };

  const updateMessage = async (id: string, newText: string) => {
    try {
      const messageRef = ref(database, `messages/${id}`);
      await update(messageRef, {
        text: newText,
        timestamp: Date.now(),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error updating message:", err);
    }
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div className="text-error">Error: {error}</div>;
  }

  if (errorPosition) {
    return (
      <div className="text-error">
        Location error: {errorPosition.message}
      </div>
    );
  }

  return (
    <div>
      <h1>Convoy Live</h1>

      <section>
        <h2>Map</h2>
        <ConvoyMap positions={positions} currentUserId={CURRENT_USER_ID} />
      </section>

      <section>
        <h2>Your position ({CURRENT_USER_ID})</h2>
        <p>
          {position?.coords.latitude?.toFixed(5)},{" "}
          {position?.coords.longitude?.toFixed(5)}
          {position?.coords.accuracy != null && (
            <> (accuracy: {Math.round(position.coords.accuracy)} m)</>
          )}
        </p>
      </section>

      <section>
        <h2>All users</h2>
        {Object.keys(positions).length === 0 ? (
          <p>No positions yet.</p>
        ) : (
          <ul>
            {Object.entries(positions).map(([userId, pos]) => (
              <li key={userId}>
                <strong>{userId}</strong>: {pos.latitude.toFixed(5)},{" "}
                {pos.longitude.toFixed(5)} (±{Math.round(pos.accuracy)} m)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Distances between users</h2>
        {pairDistances.length === 0 ? (
          <p>Need at least two users to show distances.</p>
        ) : (
          <ul>
            {pairDistances.map((pair) => (
              <li key={`${pair.userA}-${pair.userB}`}>
                {pair.userA} ↔ {pair.userB}: {pair.km} km ({pair.meters} m /{" "}
                {pair.miles} mi)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Distance from you ({CURRENT_USER_ID})</h2>
        {Object.keys(distancesFromCurrentUser).length === 0 ? (
          <p>No other users yet.</p>
        ) : (
          <ul>
            {Object.entries(distancesFromCurrentUser).map(
              ([userId, meters]) => {
                const other = positions[userId];
                const lowAccuracy =
                  other &&
                  (other.accuracy > MAX_ACCURACY_METERS ||
                    (positions[CURRENT_USER_ID]?.accuracy ?? 0) >
                      MAX_ACCURACY_METERS);
                return (
                  <li key={userId}>
                    → {userId}: {(meters / 1000).toFixed(2)} km ({meters} m)
                    {lowAccuracy && (
                      <span className="text-warning">
                        {" "}
                        (low GPS accuracy)
                      </span>
                    )}
                  </li>
                );
              },
            )}
          </ul>
        )}
      </section>

      <input
        type="text"
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
        placeholder="Type a new message"
      />
      <button onClick={writeNewMessage}>Send Message</button>

      <h2>Messages:</h2>
      {messages.length === 0 ? (
        <p>No messages yet. Send one!</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>
              {msg.text} (sent at:{" "}
              {new Date(msg.timestamp).toLocaleTimeString()})
              <button
                onClick={() =>
                  updateMessage(
                    msg.id,
                    prompt("New text:", msg.text) || msg.text,
                  )
                }
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataComponent;
