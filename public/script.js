const products = [
    { id: 1, name: 'Product 1', price: 19.99, image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: 29.99, image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: 9.99, image: 'product3.jpg' },
];

const productList = document.getElementById('product-list');
const cartIcon = document.getElementById('cart-icon');
const cartDisplay = document.getElementById('cart-display');
const cartItems = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

let cart = [];

// Function to render product cards
function renderProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productCard);

        // Add event listener to the add to cart button
        productCard.querySelector('button').addEventListener('click', () => {
            addToCart(product.id);
        });
    });
}

// Function to add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

// Function to update the cart display
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(listItem);
        total += item.price;
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    cartIcon.textContent = `Cart (${cart.length})`;

    // Show/hide cart display
    if (cart.length > 0) {
        cartDisplay.style.display = 'block';
    } else {
        cartDisplay.style.display = 'none';
    }
}

// Checkout button functionality
checkoutButton.addEventListener('click', () => {
    alert('Checkout functionality will be implemented in a future update.');
});

// Initial render
renderProducts();
