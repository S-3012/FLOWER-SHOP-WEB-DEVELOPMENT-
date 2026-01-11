// ================== Categories ==================
const categories = [
  { id: 1, title: "Bouquets", assets: 3 },
  { id: 2, title: "Plants", assets: 2 },
  { id: 3, title: "Gifts", assets: 2 }
];

// ================== Products ==================
const products = [
  { title: "Rose Bouquet", type: "Bouquet", desc: "A dozen fresh red roses wrapped beautifully.", img: "https://vilniusflowers.lt/wp-content/uploads/2019/09/100-red-roses-bouquet.jpg", price: 25 },
  { title: "Tulip Delight", type: "Bouquet", desc: "Bright tulips to bring joy to any day.", img: "https://www.gardeningexpress.co.uk/media/product/c62/tulip-delight-mix-pack-of-12-8e8.jpg", price: 20 },
  { title: "Orchid Elegance", type: "Bouquet", desc: "Exotic orchids for a touch of luxury.", img: "https://video.cgtn.com/news/3d3d774e7759444d34457a6333566d54/video/17014c2d76314fe39c29a7cef9a40119/17014c2d76314fe39c29a7cef9a40119.jpg", price: 30 },
  { title: "Peace Lily", type: "Plant", desc: "Easy-care indoor plant that purifies air.", img: "https://hips.hearstapps.com/hmg-prod/images/peace-lilies-royalty-free-image-1722283092.jpg?crop=0.99953xw:1xh;center", price: 18 },
  { title: "Succulent Set", type: "Plant", desc: "Cute mini succulents in ceramic pots.", img: "https://www.familyhandyman.com/wp-content/uploads/2018/04/shutterstock_171755639.jpg", price: 15 },
  { title: "Chocolate Hamper", type: "Gift", desc: "Sweet treats paired with flowers.", img: "https://hattys.co.uk/wp-content/uploads/2021/10/MULTI-CHOC-HAMPER.png", price: 22 },
  { title: "Teddy & Roses", type: "Gift", desc: "A cuddly teddy with a rose bouquet.", img: "https://cdnnew.igp.com/f_auto,q_auto,t_pnopt9prodlp/products/p-bouquet-of-10-yellow-roses-in-vase-with-teddy-112398-m.jpg", price: 28 }
];

// ================== Special Offers ==================
const offers = [
  { title: "Valentine’s Rose Combo", desc: "Roses + Teddy at a sweet price.", img: "https://picsum.photos/400/300?random=21", price: 28, discount: "20% OFF" },
  { title: "Spring Tulip Sale", desc: "Bright tulips with seasonal discount.", img: "https://picsum.photos/400/300?random=22", price: 18, discount: "15% OFF" },
  { title: "Succulent Starter Pack", desc: "Mini succulents with ceramic pots.", img: "https://picsum.photos/400/300?random=23", price: 12, discount: "10% OFF" }
];

// ================== Testimonials ==================
const testimonials = [
  { quote: "The roses were fresh and stunning. Delivery was on time!", name: "Anita S." },
  { quote: "Loved the tulip bouquet — brightened my whole week!", name: "Rahul M." },
  { quote: "Succulent set was adorable and easy to care for.", name: "Priya K." },
  { quote: "Checkout was smooth, and the teddy combo made my daughter so happy!", name: "Vikram P." }
];

// ================== Cart State ==================
let cart = [];

// ================== Render Categories ==================
const taskBoard = document.getElementById("taskBoard");
categories.forEach(c => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<div class="card-content"><h3>${c.title}</h3><p>${c.assets} items</p></div>`;
  taskBoard.appendChild(card);
});

// ================== Render Products ==================
function renderProducts(filter = "", category = "all") {
  const assetGrid = document.getElementById("assetGrid");
  assetGrid.innerHTML = "";

  products
    .filter(p =>
      (p.title.toLowerCase().includes(filter.toLowerCase()) ||
       p.type.toLowerCase().includes(filter.toLowerCase())) &&
      (category === "all" || p.type === category)
    )
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="card-content">
          <h3>${p.title}</h3>
          <p>Type: ${p.type}</p>
          <p>Price: $${p.price}</p>
          <span class="toggle">Show Description</span>
          <p class="hidden">${p.desc}</p>
          <button class="buyBtn">Buy Now</button>
        </div>
      `;
      const toggle = card.querySelector(".toggle");
      const desc = card.querySelector(".hidden");
      toggle.addEventListener("click", () => {
        desc.classList.toggle("hidden");
        toggle.textContent = desc.classList.contains("hidden") ? "Show Description" : "Hide Description";
      });

      const buyBtn = card.querySelector(".buyBtn");
      buyBtn.addEventListener("click", () => addToCart(p));

      assetGrid.appendChild(card);
    });
}

// Initial render
renderProducts();

// ================== Search + Category Filter ==================
const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");

function updateFilters() {
  renderProducts(searchBar.value, categoryFilter.value);
}
searchBar.addEventListener("input", updateFilters);
categoryFilter.addEventListener("change", updateFilters);

// ================== Cart Functions ==================
function addToCart(product) {
  const existing = cart.find(item => item.title === product.title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function updateQuantity(index, newQty) {
  if (newQty <= 0) {
    removeFromCart(index);
  } else {
    cart[index].quantity = newQty;
    renderCart();
  }
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.title} - $${item.price}
      <input type="number" class="quantity" value="${item.quantity}" min="1">
      <button class="removeBtn">Remove</button>
    `;

    const qtyInput = li.querySelector(".quantity");
    qtyInput.addEventListener("change", e => {
      updateQuantity(index, parseInt(e.target.value));
    });

    const removeBtn = li.querySelector(".removeBtn");
    removeBtn.addEventListener("click", () => removeFromCart(index));

    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total}`;
}

// ================== Checkout Popup ==================
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPopup = document.getElementById("checkoutPopup");
const closePopup = document.getElementById("closePopup");

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  checkoutPopup.classList.remove("hidden");
  cart = [];
  renderCart();
});

closePopup.addEventListener("click", () => {
  checkoutPopup.classList.add("hidden");
});

// ================== Carousel ==================
const featuredProducts = [
  { title: "Rose Bouquet", img: "https://cdn.bloomsflora.com/uploads/product/bloomsflora/OCT2024/EternalRedRoseBouquet-1730120069749.webp" },
  { title: "Orchid Elegance", img: "https://picsum.photos/800/300?random=12" },
  { title: "Chocolate Hamper", img: "https://cdnjs.angroos.com/wp-content/uploads/2023/11/IMG_4406-2-scaled.jpg" }
];

const carouselTrack = document.getElementById("carouselTrack");
featuredProducts.forEach(fp => {
  const item = document.createElement("div");
  item.className = "carousel-item";
  item.innerHTML = `
    <img src="${fp.img}" alt="${fp.title}">
    <div class="carousel-caption">${fp.title}</div>
  `;
  carouselTrack.appendChild(item);
});

let currentIndex = 0;
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function updateCarousel() {
  const width = carouselTrack.clientWidth;
  carouselTrack.style.transform = `translateX(-${currentIndex * width}px)`;
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + featuredProducts.length) % featuredProducts.length;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % featuredProducts.length;
  updateCarousel();
});

// ================== Auto-Slide ==================
setInterval(() => {
  currentIndex = (currentIndex + 1) % featuredProducts.length;
  updateCarousel();
}, 5000); // slides every 5 seconds

// ================== Special Offers Rendering ==================
const offersGrid = document.getElementById("offersGrid");
offers.forEach(o => {
  const card = document.createElement("div");
  card.className = "offer-card";
  card.innerHTML = `
    <span class="badge">${o.discount}</span>
    <img src="${o.img}" alt="${o.title}">
    <div class="offer-content">
      <h3>${o.title}</h3>
      <p>${o.desc}</p>
      <p>Price: $${o.price}</p>
      <button class="buyBtn">Buy Now</button>
    </div>
  `;
  const buyBtn = card.querySelector(".buyBtn");
  buyBtn.addEventListener("click", () => addToCart(o));
  offersGrid.appendChild(card);
});

// ================== Testimonials Rendering ==================
const testimonialGrid = document.getElementById("testimonialGrid");
testimonials.forEach(t => {
  const card = document.createElement("div");
  card.className = "testimonial-card";
  card.innerHTML = `
    <p>"${t.quote}"</p>
    <span>- ${t.name}</span>
  `;
  testimonialGrid.appendChild(card);
});

// ================== Contact Form Logic ==================
const contactForm = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

contactForm.addEventListener("submit", e => {
  e.preventDefault(); // prevent page reload
  formResponse.classList.remove("hidden");
  contactForm.reset();
});
