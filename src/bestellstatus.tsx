import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json"; // Importiere die Konfigurationsdaten
import "./index.css";

// Konfiguriere Amplify mit den geladenen Daten
Amplify.configure(outputs);

const client = generateClient<Schema>();

function Bestellstatus() {
  const [orders, setOrders] = useState<Array<Schema["Order"]["type"]>>([]);
  const [lastOrderDate, setLastOrderDate] = useState<string | null>(null);

  useEffect(() => {
    // Abrufen der Bestellungen aus der AWS API
    const subscription = client.models.Order.observeQuery().subscribe({
      next: (data) => {
        const items = [...data.items];
        setOrders(items);

        // Finde das neueste Datum
        if (items.length > 0) {
          const latestOrder = items.reduce((latest, current) =>
            new Date(current.updatedAt || current.createdAt || 0) >
            new Date(latest.updatedAt || latest.createdAt || 0)
              ? current
              : latest
          );
          setLastOrderDate(
            new Date(latestOrder.updatedAt || latestOrder.createdAt || "").toLocaleString("de-DE")
          );
        } else {
          setLastOrderDate(null);
        }
      },
    });

    // Bereinigen der Subscription bei Komponentendemontage
    return () => subscription.unsubscribe();
  }, []);

  return (
    <main>
      <header className="app-header">
        <h1>Bestellstatus</h1>
      </header>
      <div className="status">
        <h2>Rückmeldungen</h2>
        <p>
          <span>{orders.length} von 25</span> Rückmeldungen erhalten
        </p>
        <p>Neueste Rückmeldung: <span>{lastOrderDate || "noch keine"}</span></p>
       
        <p><span>Frist:</span> bis zum <span>15.05.2025</span></p>
      </div>
      <div className="status">
        <h2>Bestellstatus</h2>
        <p>Aktueller Status: <span>Nicht Bestellt</span></p>
      </div>
      <div className="status">
        <h2>Lieferung</h2>
        <p>Lieferstatus: <span>-</span></p>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Bestellstatus />
  </React.StrictMode>
);