// Curated Footwear Catalog using verified online Unsplash photography
const products = [
    {
        id: 1,
        name: "AeroPulse Carbon v3",
        category: "running",
        price: 185.00,
        rating: 4.9,
        reviews: 312,
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        description: "Featherweight road racer engineered with responsive nitrogen midsole foam and breathable engineered mesh."
    },
    {
        id: 2,
        name: "Court Classic Low Leather",
        category: "lifestyle",
        price: 125.00,
        rating: 4.8,
        reviews: 428,
        tag: "ESSENTIAL",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        description: "Full-grain tumbled leather upper paired with a cushioned Ortholite insole for effortless daily wear."
    },
    {
        id: 3,
        name: "Skyline Dunk High-Top",
        category: "basketball",
        price: 165.00,
        rating: 4.9,
        reviews: 194,
        tag: "NEW DROP",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
        description: "Ankle-locking padded collar and multidirectional herringbone traction built for explosive court cuts."
    },
    {
        id: 4,
        name: "Velocity Knit Runner",
        category: "running",
        price: 145.00,
        rating: 4.7,
        reviews: 215,
        tag: "LIGHTWEIGHT",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        description: "Sock-like adaptive knit fit with energy-returning heel pods for daily 5K to half-marathon training."
    },
    {
        id: 5,
        name: "Metro Retro Suede '88",
        category: "lifestyle",
        price: 118.00,
        rating: 4.8,
        reviews: 367,
        tag: "CLASSIC",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        description: "Vintage heritage runner silhouette featuring soft suede overlays and gum-rubber traction."
    },
    {
        id: 6,
        name: "Apex Flight Mid",
        category: "basketball",
        price: 175.00,
        rating: 4.9,
        reviews: 158,
        tag: "PRO SERIES",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        description: "Dual-chamber air cushioning absorbs hard landings while lateral outriggers keep your foot stable."
    },
    {
        id: 7,
        name: "RidgeWalker Waterproof Boot",
        category: "boots",
        price: 210.00,
        rating: 4.9,
        reviews: 142,
        tag: "ALL-WEATHER",
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
        description: "Seam-sealed full-grain leather boot with deep-lugged Vibram outsole for rain, trail, and winter streets."
    },
    {
        id: 8,
        name: "CloudStep Daily Slip-On",
        category: "lifestyle",
        price: 98.00,
        rating: 4.6,
        reviews: 289,
        tag: "COMFORT PICK",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
        description: "Minimalist everyday trainer with dual-density memory foam and zero break-in time."
    }
];

let cart = JSON.parse(localStorage.getItem("solecraft_cart")) || [];
let selectedSize = "US 10";

// DOM Elements
const productGrid = document.getElementById("productGrid");
const filterTabs = document.getElementById("filterTabs");
const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const shippingNote = document.getElementById("shippingNote");
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

// Render Product Cards
function renderProducts(filter = "all") {
    const filtered = filter === "all"
        ? products
        : products.filter(p => p.category === filter);

    productGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-img-box">
                <span class="product-tag">${product.tag}</span>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="quick-view-btn" onclick="openProductModal(${product.id})">Quick View & Sizes</button>
            </div>
            <div class="product-body">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">&#9733; ${product.rating} <span>(${product.reviews} reviews)</span></div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">+ Add to Bag</button>
                </div>
            </div>
        </article>
    `).join("");
}

// Category Filtering
filterTabs.addEventListener("click", (e) => {
    if (!e.target.classList.contains("filter-btn")) return;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    renderProducts(e.target.dataset.filter);
});

// Cart Functions
function saveCart() {
    localStorage.setItem("solecraft_cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId, size = "US 10") {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId && item.size === size);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            qty: 1
        });
    }

    saveCart();
    showToast(`Added ${product.name} (${size}) to bag`);
}

function updateQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartCount.textContent = totalItems;
    drawerCount.textContent = totalItems;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    if (subtotal >= 120) {
        shippingNote.textContent = "You unlocked FREE Express Shipping!";
        shippingNote.style.color = "#16a34a";
    } else {
        const diff = (120 - subtotal).toFixed(2);
        shippingNote.textContent = `Add $${diff} more for FREE express shipping`;
        shippingNote.style.color = "#5c626d";
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="color:#5c626d; text-align:center; margin-top:40px;">Your shopping bag is empty.</p>`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-meta">Size: ${item.size} &bull; $${item.price.toFixed(2)}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${idx}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${idx})">Remove</button>
                </div>
            </div>
        </div>
    `).join("");
}

// Drawer Toggle
function toggleCart(open) {
    cartDrawer.classList.toggle("open", open);
    cartOverlay.classList.toggle("open", open);
}

cartToggle.addEventListener("click", () => toggleCart(true));
closeCart.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

// Quick View Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    selectedSize = "US 10";

    const sizes = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];

    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="modal-details">
            <span class="product-category">${product.category}</span>
            <h2 style="margin:6px 0 10px;">${product.name}</h2>
            <p style="font-size:1.3rem; font-weight:800; margin-bottom:14px;">$${product.price.toFixed(2)}</p>
            <p style="color:#5c626d; font-size:0.94rem; margin-bottom:18px;">${product.description}</p>
            <label style="font-size:0.85rem; font-weight:700;">Select Size:</label>
            <div class="size-selector" id="modalSizes">
                ${sizes.map(s => `
                    <button type="button" class="size-chip ${s === selectedSize ? 'selected' : ''}" onclick="selectSize(this, '${s}')">${s}</button>
                `).join("")}
            </div>
            <button class="btn btn-primary btn-full" onclick="addToCart(${product.id}, selectedSize); closeProductModal();">Add to Bag</button>
        </div>
    `;
    productModal.classList.add("open");
}

function selectSize(btn, size) {
    selectedSize = size;
    document.querySelectorAll(".size-chip").forEach(c => c.classList.remove("selected"));
    btn.classList.add("selected");
}

function closeProductModal() {
    productModal.classList.remove("open");
}

closeModal.addEventListener("click", closeProductModal);
productModal.addEventListener("click", (e) => {
    if (e.target === productModal) closeProductModal();
});

// Toast & Checkout & Mobile Nav
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your bag is empty!");
        return;
    }
    showToast("Order placed! Thank you for shopping with SOLECRAFT.");
    cart = [];
    saveCart();
    toggleCart(false);
});

document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Subscribed! Check your inbox for 15% off.");
    e.target.reset();
});

document.getElementById("mobileMenuBtn").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("active");
});

// Init
renderProducts();
updateCartUI();
