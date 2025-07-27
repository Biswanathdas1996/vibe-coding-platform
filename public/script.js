// Sample product data (replace with actual data)
const products = [
    { id: 1, name: 'Product 1', price: 19.99, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 29.99, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: 9.99, image: 'https://via.placeholder.com/150' },
];

// Cart (in-memory for now)
let cart = [];

// Function to render products on the product page
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);

        // Add event listener to the add to cart button
        const addToCartButton = productCard.querySelector('button');
        addToCartButton.addEventListener('click', () => addToCart(product.id));
    });
}

// Function to add an item to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartDisplay();
    }
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = ''; // Clear existing content

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <button data-id="${item.id}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Add event listener to the remove button
        const removeButton = cartItem.querySelector('button');
        removeButton.addEventListener('click', () => removeFromCart(item.id));
    });

    // Update cart total
    updateCartTotal();
}

// Function to update the cart total
function updateCartTotal() {
    const cartTotalElement = document.querySelector('.cart-total');
    if (!cartTotalElement) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Function to render order history (dummy data)
function renderOrders() {
    const ordersContainer = document.querySelector('.order-history');
    if (!ordersContainer) return;

    // Dummy order data
    const orders = [
        { id: 1, date: '2024-01-20', items: [{ name: 'Product 1', price: 19.99 }], total: 19.99 },
        { id: 2, date: '2024-01-21', items: [{ name: 'Product 2', price: 29.99 }, { name: 'Product 3', price: 9.99 }], total: 39.98 }
    ];

    ordersContainer.innerHTML = ''; // Clear existing content

    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.innerHTML = `
            <h3>Order #${order.id} - ${order.date}</h3>
            <ul>
                ${order.items.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p>Total: $${order.total.toFixed(2)}</p>
        `;
        ordersContainer.appendChild(orderItem);
    });
}

// Initialize the application based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('products.html')) {
        renderProducts();
    } else if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
    } else if (window.location.pathname.includes('orders.html')) {
        renderOrders();
    }
});
