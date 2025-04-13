import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "./App.css";

const client = generateClient<Schema>();

function App() {
  const [, setOrders] = useState<Array<Schema["Order"]["type"]>>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wantsTShirt: false,
    size: "",
    initials: "",
    paymentMethod: "",
  });

  useEffect(() => {
    console.log("Client models:", client.models); // Debugging-Log
    // Beobachte Änderungen an der Order-Tabelle und aktualisiere die lokale Liste
    client.models.Order.observeQuery().subscribe({
      next: (data) => setOrders([...data.items]),
    });
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = event.target;
    const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Erstelle eine neue Bestellung in der Order-Tabelle
    client.models.Order.create(formData);
    setFormData({
      firstName: "",
      lastName: "",
      wantsTShirt: false,
      size: "",
      initials: "",
      paymentMethod: "",
    });
  }

  return (
    <main>
      <header className="app-header">
        <h1>AK25 T-Shirt Bestellungen</h1>
      </header>
      <form onSubmit={handleSubmit} className="order-form">
        <label>
          Vorname:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Nachname:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          T-Shirt bestellen?
          <input
            type="checkbox"
            name="wantsTShirt"
            checked={formData.wantsTShirt}
            onChange={handleInputChange}
          />
        </label>
        {formData.wantsTShirt && (
          <>
            <label>
              Größe:
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              >
                <option value="">Bitte wählen</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">3XL</option>
                <option value="4XL">4XL</option>
                <option value="5XL">5XL</option>

              </select>
            </label>
            <label>
              Name auf dem T-Shirt:
              <input
                type="text"
                name="initials"
                value={formData.initials}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Zahlungsart:
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="">Bitte wählen</option>
                <option value="bar">Barzahlung</option>
                <option value="paypal">PayPal</option>
                <option value="bankTransfer">Überweisung</option>
              </select>
            </label>
          </>
        )}
        <button type="submit">Weiter</button>
      </form>

     
    </main>
  );
}

export default App;