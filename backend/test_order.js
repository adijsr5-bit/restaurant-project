const axios = require('axios');

async function testOrder() {
  try {
    const res = await axios.post('https://restaurant-project-185t.onrender.com/api/orders', {
      items: [{ _id: '60d21b4667d0d8992e610c85', quantity: 1, price: 10 }],
      totalAmount: 10,
      customerDetails: { name: 'Test', tableNumber: '1' },
      orderType: 'dine-in'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testOrder();
