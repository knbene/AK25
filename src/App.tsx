import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [orders, setOrders] = useState<Array<Schema["Order"]["type"]>>([]);

  useEffect(() => {
    // Beobachte Änderungen an der Order-Tabelle und aktualisiere die lokale Liste
    client.models.Order.observeQuery().subscribe({
      next: (data) => setOrders([...data.items]),
    });
  }, []);

  function createOrder() {
    const firstName = window.prompt("Vorname:");
    const lastName = window.prompt("Nachname:");
    const wantsTShirt = window.confirm("T-Shirt bestellen?");
    let size = "";
    let initials = "";
    let paymentMethod = "";

    if (wantsTShirt) {
      size = window.prompt("Größe (S, M, L, XL):") || "";
      initials = window.prompt("Initialen:") || "";
      paymentMethod = window.prompt("Zahlungsart (PayPal, Überweisung, Bar):") || "";
    }

    // Erstelle eine neue Bestellung in der Order-Tabelle
    client.models.Order.create({
      firstName,
      lastName,
      wantsTShirt,
      size,
      initials,
      paymentMethod,
    });
  }

  return (
    <main>
      <h1>Bestellungen</h1>
      <button onClick={createOrder}>+ Neue Bestellung</button>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.firstName} {order.lastName} - T-Shirt:{" "}
            {order.wantsTShirt ? `Ja (Größe: ${order.size}, Initialen: ${order.initials}, Zahlungsart: ${order.paymentMethod})` : "Nein"}
          </li>
        ))}
      </ul>
      <div>
        🥳 App erfolgreich verbunden. Neue Bestellungen werden in AWS Data Manager sichtbar.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Weitere Schritte im Tutorial ansehen.
        </a>
      </div>
    </main>
  );
}

export default App;