import React, { useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'https://restaurant-backend-production-4e8c.up.railway.app';

const sampleMenu = [
  { id: 1, name: 'Fried Rice', price: 350 },
  { id: 2, name: 'Chicken Curry', price: 450 },
  { id: 3, name: 'Coke', price: 120 },
  { id: 4, name: 'Vegetable Salad', price: 200 },
];

function CustomerOrder() {
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState(
    sampleMenu.map(item => ({ ...item, quantity: 0, notes: '' }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle quantity change
  const updateQuantity = (id, qty) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  // Handle notes change
  const updateNotes = (id, notes) => {
    setItems(items.map(item => item.id === id ? { ...item, notes } : item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!tableNumber.trim()) {
      alert('Please enter your table number');
      return;
    }

    // Filter only ordered items with quantity > 0
    const orderedItems = items
      .filter(item => item.quantity > 0)
      .map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes.trim()
      }));

    if (orderedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${SERVER_URL}/api/orders`, {
        tableNumber,
        items: orderedItems
      });

      setSuccessMessage('Thank you! Your order has been placed.');
      // Reset form
      setTableNumber('');
      setItems(sampleMenu.map(item => ({ ...item, quantity: 0, notes: '' })));
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Table Number: <br />
            <input
              type="text"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              required
              placeholder="e.g. T1"
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        </div>

        <h3>Menu</h3>
        {items.map(item => (
          <div key={item.id} style={{ marginBottom: 10, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
            <strong>{item.name} (Rs. {item.price})</strong><br />
            Quantity: <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 0)}
              style={{ width: 60, marginRight: 12 }}
            />
            Notes: <input
              type="text"
              value={item.notes}
              onChange={e => updateNotes(item.id, e.target.value)}
              placeholder="e.g. no chili"
              style={{ width: '60%' }}
            />
          </div>
        ))}

        <button type="submit" disabled={submitting} style={{ marginTop: 20, padding: '10px 20px' }}>
          {submitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>

      {successMessage && <p style={{ color: 'green', marginTop: 20 }}>{successMessage}</p>}
    </div>
  );
}

export default CustomerOrder;
