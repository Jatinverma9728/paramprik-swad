import { useState, useEffect } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      //  database query to get all orders (NO FILTERING BY EMAIL!)
      const allOrders = await getAllOrdersFromDatabase();
      setOrders(allOrders);
    }

    fetchOrders();
  }, []);

  // ... rest of the component ...
}
