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

// Current meal for modal
let currentMeal = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const mealsContainer = document.getElementById('mealsContainer');
const modal = document.getElementById('productModal');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createMealCards();
    setupModalListeners();
    setupSearch();
    setupFilterButtons();
    setupScrollButtons();
});

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (hasHalfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Create meal cards
function createMealCards(mealsToShow = meals) {
    mealsContainer.innerHTML = '';
    
    if (mealsToShow.length === 0) {
        mealsContainer.innerHTML = '<p class="no-results">No dishes found. Try another search.</p>';
        return;
    }
    
    mealsToShow.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'meal-card';
        card.dataset.category = meal.category;
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${meal.image}" alt="${meal.name}">
                <span class="category-label">${meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}</span>
                <button class="fav-btn"><i class="far fa-heart"></i></button>
            </div>
            <div class="card-content">
                <h3>${meal.name}</h3>
                <div class="rating">
                    ${generateStarRating(meal.rating)}
                    <span>${meal.rating}</span>
                </div>
            </div>
            <div class="card-footer">
                <span class="price">$${meal.price.toFixed(2)}</span>
                <button class="add-btn" title="Add to cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        `;
        
        // Add click event to the whole card (excluding favorite button)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.fav-btn') && !e.target.closest('.add-btn')) {
                openModal(meal);
            }
        });
        
        // Add click event to "Add to Cart" button in card
        const addBtn = card.querySelector('.add-btn');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(meal);
        });
        
        mealsContainer.appendChild(card);
    });
    
    // Setup favorite buttons
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.innerHTML = this.innerHTML.includes('far') ? 
                '<i class="fas fa-heart"></i>' : 
                '<i class="far fa-heart"></i>';
        });
    });
}

// Modal functionality
function openModal(meal) {
    currentMeal = meal;
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalRating = document.getElementById('modalRating');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    
    // Set modal content
    modalTitle.textContent = meal.name;
    modalImage.src = meal.image;
    modalImage.alt = meal.name;
    modalRating.innerHTML = `${generateStarRating(meal.rating)} <span>${meal.rating} (${meal.reviews} reviews)</span>`;
    modalCategory.textContent = meal.category.charAt(0).toUpperCase() + meal.category.slice(1);
    modalPrice.textContent = `$${meal.price.toFixed(2)}`;
    modalTotalPrice.textContent = `$${meal.price.toFixed(2)}`;
    
    // Reset quantity
    document.querySelector('.quantity').textContent = '1';
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateTotalPrice(quantity) {
    const total = (currentMeal.price * quantity).toFixed(2);
    document.getElementById('modalTotalPrice').textContent = `$${total}`;
}
 var btnClose = document.querySelector('.close-modal');
 btnClose.addEventListener("click" , closeModal);
 
// Setup modal event listeners
function setupModalListeners() {
    // Close modal button
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const quantityElement = this.closest('.quantity-selector').querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('minus')) {
                quantity = quantity > 1 ? quantity - 1 : 1;
            } else {
                quantity++;
            }
            
            quantityElement.textContent = quantity;
            updateTotalPrice(quantity);
        });
    });
    
    // Modal add to cart button
    document.querySelector('.modal-add-btn').addEventListener('click', function() {
        const quantity = parseInt(document.querySelector('.quantity').textContent);
        const total = (currentMeal.price * quantity).toFixed(2);
        
        alert(`Added ${quantity}x ${currentMeal.name} to cart\nTotal: $${total}`);
        closeModal();
    });
}

// Search functionality
function setupSearch() {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Filter meals based on search term (name or category)
        const filteredMeals = meals.filter(meal => 
            meal.name.toLowerCase().includes(searchTerm) || 
            meal.category.toLowerCase().includes(searchTerm)
        );
        
        createMealCards(filteredMeals);
    });
}

// Filter buttons functionality
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter meals
            const category = this.dataset.category;
            if (category === 'all') {
                createMealCards();
            } else {
                const filteredMeals = meals.filter(meal => meal.category === category);
                createMealCards(filteredMeals);
            }
        });
    });
}

// Scroll buttons functionality
function setupScrollButtons() {
    const scrollContainer = document.querySelector('.controls');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    scrollLeftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    scrollRightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });
    
    // Update scroll buttons visibility
    const updateScrollButtons = () => {
        scrollLeftBtn.style.display = scrollContainer.scrollLeft > 0 ? 'flex' : 'none';
        scrollRightBtn.style.display = 
            scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth ? 'flex' : 'none';
    };
    
    updateScrollButtons();
    scrollContainer.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
}


// Cart functionality
    let cart = [];
    
    // Initialize cart
    function initCart() {
        // Load cart from localStorage if available
        const savedCart = localStorage.getItem('moroccanFoodCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
        
        // Setup event listeners
        setupCartListeners();
    }
    
    // Add item to cart (called from modal)
    function addToCart(meal, quantity) {
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === meal.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: meal.id,
                name: meal.name,
                price: meal.price,
                image: meal.image,
                quantity: quantity
            });
        }
        
        // Save to localStorage
        localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
        
        // Update UI
        updateCartUI();
        
        // Show confirmation
        showCartNotification(`${quantity}x ${meal.name} added to cart`);
    }
    
    // Update cart UI
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalPriceElement = document.querySelector('.total-price');
        
        // Update count
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        // Update items list
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            totalPriceElement.textContent = '0.00 Dhs';
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} Dhs</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-qty" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total price
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} Dhs`;
        
        // Add event listeners to new buttons
        setupCartItemListeners();
    }
    
    // Setup cart event listeners
    function setupCartListeners() {
        // Toggle cart visibility
        document.querySelector('.cart-toggle-btn').addEventListener('click', () => {
            document.querySelector('.cart-sidebar').classList.add('open');
        });
        
        // Close cart
        document.querySelector('.close-cart').addEventListener('click', () => {
            document.querySelector('.cart-sidebar').classList.remove('open');
        });
        
        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Proceeding to checkout!');
                // In a real app, you would redirect to checkout page
            } else {
                alert('Your cart is empty!');
            }
        });
    }
    
    // Setup listeners for cart items (quantity changes, remove)
    function setupCartItemListeners() {
        // Increase quantity
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    item.quantity++;
                    localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
                    updateCartUI();
                }
            });
        });
        
        // Decrease quantity
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        // Remove if quantity would go to 0
                        cart = cart.filter(item => item.id !== itemId);
                    }
                    localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
                    updateCartUI();
                }
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                cart = cart.filter(item => item.id !== itemId);
                localStorage.setItem('moroccanFoodCart', JSON.stringify(cart));
                updateCartUI();
            });
        });
    }
    
    // Show notification when item is added
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Modify your modal "Add to Cart" button event listener to use this function
    document.querySelector('.modal-add-btn').addEventListener('click', function() {
        const quantity = parseInt(document.querySelector('.quantity').textContent);
        addToCart(currentMeal, quantity);
        closeModal();
    });
    
    // Initialize cart when page loads
    document.addEventListener('DOMContentLoaded', initCart);