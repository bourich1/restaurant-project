// Array of meal objects
const meals = [
    {
        id: 1,
        name: "Chicken Tajine with Olives",
        category: "tajines",
        price: 14.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143",
        reviews: 120
    },
    {
        id: 2,
        name: "Seven Vegetable Couscous",
        category: "couscous",
        price: 12.99,
        rating: 4.0,
        image: "https://images.unsplash.com/photo-1517685633466-403d6955aeab",
        reviews: 95
    },
    {
        id: 3,
        name: "Lamb Tajine with Prunes",
        category: "tajines",
        price: 16.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae",
        reviews: 85
    },
    {
        id: 4,
        name: "Seafood Pastilla",
        category: "pastilla",
        price: 15.50,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
        reviews: 64
    },
    {
        id: 5,
        name: "Harira Soup",
        category: "harira",
        price: 8.99,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        reviews: 112
    },
    {
        id: 6,
        name: "Rfissa with Msemen",
        category: "rfissa",
        price: 13.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        reviews: 78
    },
    {
        id: 7,
        name: "Beef Tajine with Figs",
        category: "tajines",
        price: 17.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
        reviews: 92
    },
    {
        id: 8,
        name: "Msemen with Honey",
        category: "msemen",
        price: 6.99,
        rating: 4.1,
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
        reviews: 135
    },
    {
        id: 9,
        name: "Grilled Fish Chermoula",
        category: "hout",
        price: 18.50,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55",
        reviews: 105
    },
    {
        id: 10,
        name: "Vegetable Tajine",
        category: "tajines",
        price: 12.99,
        rating: 4.0,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        reviews: 88
    }
];

let currentMeal = null;
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    createMealCards();
    setupSearch();
    setupFilterButtons();
    setupModalListeners();
    setupScrollButtons();
    initCart();
    setupCheckoutListeners();
});

// ==== RENDERING ====
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star"></i>';
    if (hasHalfStar) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) html += '<i class="far fa-star"></i>';
    return html;
}

function createMealCards(mealsToShow = meals) {
    const container = document.getElementById('mealsContainer');
    container.innerHTML = mealsToShow.length ? '' : '<p class="no-results">No dishes found. Try another search.</p>';

    mealsToShow.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'meal-card';
        card.dataset.category = meal.category;
        card.innerHTML = `
            <div class="card-image">
                <img src="${meal.image}" alt="${meal.name}">
                <span class="category-label">${meal.category}</span>
                <button class="fav-btn"><i class="far fa-heart"></i></button>
            </div>
            <div class="card-content">
                <h3>${meal.name}</h3>
                <div class="rating">${generateStarRating(meal.rating)} <span>${meal.rating}</span></div>
            </div>
            <div class="card-footer">
                <span class="price">$${meal.price.toFixed(2)}</span>
                <button class="add-btn"><i class="fas fa-shopping-cart"></i></button>
            </div>
        `;
        card.querySelector('.add-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(meal);
        });
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.fav-btn')) openModal(meal);
        });
        container.appendChild(card);
    });

    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            btn.innerHTML = btn.innerHTML.includes('far') ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        });
    });
}

// ==== MODAL ====
function openModal(meal) {
    currentMeal = meal;
    document.getElementById('modalTitle').textContent = meal.name;
    document.getElementById('modalImage').src = meal.image;
    document.getElementById('modalRating').innerHTML = `${generateStarRating(meal.rating)} <span>${meal.rating} (${meal.reviews} reviews)</span>`;
    document.getElementById('modalCategory').textContent = meal.category;
    document.getElementById('modalPrice').textContent = `$${meal.price.toFixed(2)}`;
    document.getElementById('modalTotalPrice').textContent = `$${meal.price.toFixed(2)}`;
    document.querySelector('.quantity').textContent = '1';

    document.getElementById('productModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateTotalPrice(qty) {
    document.getElementById('modalTotalPrice').textContent = `$${(currentMeal.price * qty).toFixed(2)}`;
}

function setupModalListeners() {
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', e => {
        if (e.target === document.getElementById('productModal')) closeModal();
    });

    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const qtyEl = document.querySelector('.quantity');
            let qty = parseInt(qtyEl.textContent);
            qty = btn.classList.contains('minus') ? Math.max(1, qty - 1) : qty + 1;
            qtyEl.textContent = qty;
            updateTotalPrice(qty);
        });
    });

    document.querySelector('.modal-add-btn').addEventListener('click', function () {
        const qty = parseInt(document.querySelector('.quantity').textContent);
        addToCart(currentMeal, qty);
        closeModal();
    });
}

// ==== SEARCH & FILTER ====
function setupSearch() {
    document.getElementById('searchInput').addEventListener('input', function () {
        const term = this.value.toLowerCase();
        const results = meals.filter(m => m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term));
        createMealCards(results);
    });
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            createMealCards(category === 'all' ? meals : meals.filter(m => m.category === category));
        });
    });
}

function setupScrollButtons() {
    const scrollContainer = document.querySelector('.controls');
    const left = document.getElementById('scrollLeft');
    const right = document.getElementById('scrollRight');

    left.addEventListener('click', () => scrollContainer.scrollBy({ left: -200, behavior: 'smooth' }));
    right.addEventListener('click', () => scrollContainer.scrollBy({ left: 200, behavior: 'smooth' }));

    const updateButtons = () => {
        left.style.display = scrollContainer.scrollLeft > 0 ? 'flex' : 'none';
        right.style.display = scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth ? 'flex' : 'none';
    };

    updateButtons();
    scrollContainer.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
}

// ==== CART ====
function initCart() {
    const saved = localStorage.getItem('moroccanFoodCart');
    if (saved) cart = JSON.parse(saved);
    updateCartUI();
    setupCartListeners();
}

function addToCart(meal, qty) {
    const existing = cart.find(i => i.id === meal.id);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ ...meal, quantity: qty });
    }
    localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
    updateCartUI();
    showCartNotification(`${qty}x ${meal.name} added to cart`);
}

function updateCartUI() {
    const container = document.querySelector('.cart-items');
    const count = document.querySelector('.cart-count');
    const totalEl = document.querySelector('.total-price');

    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    count.textContent = totalQty;

    container.innerHTML = cart.length ? '' : '<p class="empty-cart">Your cart is empty</p>';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} Dhs</div>
                <div class="cart-item-quantity">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>`;
        container.appendChild(el);
    });

    totalEl.textContent = `${total.toFixed(2)} Dhs`;
    setupCartItemListeners();
}

function setupCartListeners() {
    document.querySelector('.cart-toggle-btn').addEventListener('click', () => {
        document.querySelector('.cart-sidebar').classList.add('open');
    });
    document.querySelector('.close-cart').addEventListener('click', () => {
        document.querySelector('.cart-sidebar').classList.remove('open');
    });
    document.querySelector('.checkout-btn').addEventListener('click', e => {
        e.preventDefault();
        if (cart.length === 0) return alert('Your cart is empty!');
        document.querySelector('.cart-sidebar').classList.remove('open');
        document.querySelector('.checkout-modal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

function setupCartItemListeners() {
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            item.quantity++;
            localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
            updateCartUI();
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
            updateCartUI();
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(i => i.id !== id);
            localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
            updateCartUI();
        });
    });
}

function showCartNotification(msg) {
    const note = document.createElement('div');
    note.className = 'cart-notification';
    note.textContent = msg;
    document.body.appendChild(note);
    setTimeout(() => note.classList.add('show'), 10);
    setTimeout(() => {
        note.classList.remove('show');
        setTimeout(() => note.remove(), 300);
    }, 3000);
}

// ==== CHECKOUT ====
function setupCheckoutListeners() {
    const form = document.getElementById('checkoutForm');
    const checkoutModal = document.querySelector('.checkout-modal');
    const successModal = document.querySelector('.success-modal');

    form.addEventListener('submit', e => {
        e.preventDefault();
        cart = [];
        localStorage.removeItem('moroccanFoodCart');
        updateCartUI();
        checkoutModal.style.display = 'none';
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    document.querySelector('.close-success').addEventListener('click', () => {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', e => {
        if (e.target === checkoutModal) checkoutModal.style.display = 'none';
        if (e.target === successModal) successModal.style.display = 'none';
    });
}

