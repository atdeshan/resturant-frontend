import React, { useState, useEffect } from "react";
import axios from "axios";
import chicken from "../images/chi.jpg";
import rice from "../images/rice.jpg";
import coke from "../images/coke.jpg";
import vegi from "../images/vegi.jpg";
import "./CustomerOrder.css"; // ⬅️ IMPORT CSS FILE

const SERVER_URL = "https://restaurant-backend-production-4e8c.up.railway.app";

const sampleMenu = [
  { id: 1, name: "Fried Rice", price: 350, image: rice },
  { id: 2, name: "Chicken Curry", price: 450, image: chicken },
  { id: 3, name: "Coke", price: 120, image: coke },
  { id: 4, name: "Vegetable Salad", price: 200, image: vegi },
];

function CustomerOrder() {
  const [tableNumber, setTableNumber] = useState("");
  const [items, setItems] = useState(
    sampleMenu.map((item) => ({ ...item, quantity: 0, notes: "" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableFromURL = params.get("table");
    if (tableFromURL) setTableNumber(tableFromURL);
  }, []);

  const updateQuantity = (id, qty) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const updateNotes = (id, notes) => {
    setItems(items.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!tableNumber.trim()) {
      alert("Please select your table number");
      return;
    }

    const orderedItems = items
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes.trim(),
      }));

    if (orderedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${SERVER_URL}/api/orders`, {
        tableNumber,
        items: orderedItems,
      });

      setSuccessMessage("Thank you! Your order has been placed.");
      setTableNumber("");
      setItems(sampleMenu.map((item) => ({ ...item, quantity: 0, notes: "" })));
    } catch (error) {
      alert("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-container">
      <h2 className="title">Place Your Order</h2>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="input-group">
          <label className="label">Table Number:</label>
          <select
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            className="select-input"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={`T${i + 1}`}>
                T{i + 1}
              </option>
            ))}
          </select>
        </div>

        <h1 className="menu-title">Menu</h1>
        <div className="menu-list">
          {items.map((item) => (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-img" />

              <div className="menu-info">
                <strong className="item-name">{item.name}</strong>
                <span className="item-price">Rs. {item.price}</span>

                <div className="quantity-box">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(0, item.quantity - 1))
                    }
                    className="qty-btn"
                  >
                    -
                  </button>

                  <input
                    type="text"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 0)
                    }
                    className="qty-input"
                  />

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateNotes(item.id, e.target.value)}
                  placeholder="e.g. no chili"
                  className="notes-input"
                />
              </div>
            </div>
          ))}
        </div>

        <h3 className="total">Total Price: Rs. {totalPrice}</h3>

        <button type="submit" disabled={submitting} className="submit-btn">
          {submitting ? "Submitting..." : "Submit Order"}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default CustomerOrder;
