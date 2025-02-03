const products = {
    mixes: [
        {name: "Aandhra paruppu podi", desc: "Andhra dal Powder", image: "images/Andhra_dal_Powder.png"},
        {name: "Karuveppilai Podi", desc: "Curry Leaves Powder", image: "images/Curry-Leaves-Powder.png"},
        {name: "Pirandai Podi", desc: "Adamant Creeper Powder", image: "images/Adamant-Creeper-Powder.png"},
        {name: "Murungai Keerai Podi", desc: "Drumstick Leaves Powder", image: "images/Moringa-Leaf-Powder.jpg"}
    ],
    s: [
        {name: "Mudakathan Keerai Podi", desc: "Balloon Vine Leaves Powder", image: "images/andhra-dal.png"}
        ,{name:"Kollu Podi", desc:"Horse Gram Powder",image:""},
        {name:"Vallarai Podi", desc:"Gotu Kola Powder",image:""},
        {name:"Manathakkali Podi", desc:"Black Nightshade Leaves Powder",image:""}
    ],
    soups: [
        {name: "Mudakathan Keerai Soup", desc: "Balloon Vine Leaves Soup", image: "images/freeze-spinach-soup.png"},
        {name: "Murungai Keerai Soup", desc: "Drumstick Leaves Soup", image: "images/moringa-spinach-soup.png"},
        {name: "Thoothuvalai Soup", desc: "Solanum Triflorum Soup", image: "images/detox-soup.png"}
    ]
};

const searchInput = document.getElementById('search-input');
const suggestions = document.querySelector('.search-suggestions');
const allProducts = [...products.mixes.flat(), ...products.soups];


// Function to render products
function renderProducts() {
    const mixContainer = document.getElementById('mixes');
    mixContainer.innerHTML = products.mixes.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <a href="product.html?name=${encodeURIComponent(product.name)}" class="view-details">View Details</a>
        </div>
    `).join('');

    const soupContainer = document.getElementById('soups');
    soupContainer.innerHTML = products.soups.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <a href="product.html?name=${encodeURIComponent(product.name)}" class="view-details">View Details</a>
        </div>
    `).join('');
    const s1 = document.getElementById('s');
    s1.innerHTML = products.s.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <h3>${product.name}</h3>
            
            <p>${product.desc}</p>
            <a href="product.html?name=${encodeURIComponent(product.name)}" class="view-details">View Details</a>
        </div>
    `).join('');
}

// Search Functionality
function handleSearch() {
    const value = this.value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(value) || 
        p.desc.toLowerCase().includes(value)
    );
    
    suggestions.innerHTML = filtered.length
        ? filtered.map(p => `
            <div class="suggestion" data-product="${p.name}">
                <i class="fas fa-leaf"></i>
                <div>
                    <div>${p.name}</div>
                    <small>${p.desc}</small>
                </div>
            </div>
        `).join('')
        : '<div class="suggestion">No matching products found</div>';
        
    suggestions.style.display = value ? 'block' : 'none';
}

// Suggestion Click Handler
function handleSuggestionClick(e) {
    const suggestion = e.target.closest('.suggestion');
    if (!suggestion) return;
    
    const productName = suggestion.dataset.product;
    window.location.href = `product.html?name=${encodeURIComponent(productName)}`;
}

// Smooth Scroll
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Event Listeners
searchInput.addEventListener('input', handleSearch);
suggestions.addEventListener('click', handleSuggestionClick);
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        suggestions.style.display = 'none';
    }
});


// 

function updateScrollState(row) {
    const threshold = 1;
    const scrollLeft = row.scrollLeft;
    const maxScroll = row.scrollWidth - row.clientWidth;
    
    if (scrollLeft <= threshold) {
        row.dataset.scrollState = 'start';
    } else if (scrollLeft >= maxScroll - threshold) {
        row.dataset.scrollState = 'end';
    } else {
        row.dataset.scrollState = 'middle';
    }
}

function scrollRow(row, direction) {
    const scrollAmount = row.clientWidth * 0.8;
    row.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Update window.onload

window.onload = renderProducts;