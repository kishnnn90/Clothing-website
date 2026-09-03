/* =========================================================
   NŌRE — MAIN JAVASCRIPT
   Products + Search + Cart + Product Page + Newsletter
========================================================= */


/* =========================================================
   PRODUCT DATABASE
========================================================= */

const products = [

  {
    id: 1,
    name: "NOIR CALLIGRAPHY TEE",
    price: 1499,
    colour: "BLACK",
    image: "assets/look-1.webp",
    description:
      "An oversized heavyweight tee featuring expressive Arabic-inspired calligraphy and a clean contemporary silhouette.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    tag: "NEW"
  },

  {
    id: 2,
    name: "SIGNATURE WHITE TEE",
    price: 1499,
    colour: "WHITE",
    image: "assets/look-2.webp",
    description:
      "A minimal oversized silhouette designed around bold graphic expression.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    tag: "NEW"
  },

  {
    id: 3,
    name: "BLUE EXPRESSION TEE",
    price: 1599,
    colour: "BLUE",
    image: "assets/look-3.webp",
    description:
      "A statement streetwear piece combining oversized proportions with expressive typography.",
    sizes: ["S", "M", "L", "XL"],
    tag: "LIMITED"
  },

  {
    id: 4,
    name: "SAND SCRIPT TEE",
    price: 1499,
    colour: "SAND",
    image: "assets/look-4.webp",
    description:
      "Soft neutral tones meet bold calligraphic graphics in this relaxed everyday silhouette.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    tag: ""
  },

  {
    id: 5,
    name: "ARCHIVE WHITE TEE",
    price: 1399,
    colour: "OFF WHITE",
    image: "assets/look-5.webp",
    description:
      "An understated oversized tee created for effortless everyday styling.",
    sizes: ["S", "M", "L", "XL"],
    tag: "ARCHIVE"
  },

  {
    id: 6,
    name: "MIDNIGHT SCRIPT TEE",
    price: 1599,
    colour: "BLACK",
    image: "assets/look-6.webp",
    description:
      "Dark monochrome streetwear with a graphic expression inspired by contemporary calligraphy.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    tag: "LIMITED"
  }

];


/* =========================================================
   CART
========================================================= */

let cart = JSON.parse(
  localStorage.getItem("noreCart")
) || [];


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

  localStorage.setItem(
    "noreCart",
    JSON.stringify(cart)
  );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

  return "₹" + Number(price).toLocaleString("en-IN");

}


/* =========================================================
   UPDATE BAG COUNT
========================================================= */

function updateBagCount() {

  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document
    .querySelectorAll(".bag-count")
    .forEach(element => {

      element.textContent = count;

    });

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(product) {

  return `

    <article class="product-card">

      <a
        class="product-image"
        href="product.html?id=${product.id}"
      >

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${
          product.tag
            ? `<span class="product-tag">${product.tag}</span>`
            : ""
        }

        <span class="quick-view">
          VIEW PRODUCT ↗
        </span>

      </a>


      <div class="product-card-info">

        <div>

          <p class="product-name">
            ${product.name}
          </p>

          <p class="product-colour">
            ${product.colour}
          </p>

        </div>


        <p class="product-price">
          ${formatPrice(product.price)}
        </p>

      </div>

    </article>

  `;

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

function loadProducts(
  containerId,
  productList = products
) {

  const container =
    document.getElementById(containerId);

  if (!container) return;

  container.innerHTML =
    productList
      .map(productCard)
      .join("");

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
  productId,
  size = "M"
) {

  const product =
    products.find(
      product => product.id === Number(productId)
    );

  if (!product) return;


  const existing =
    cart.find(
      item =>
        item.id === Number(productId) &&
        item.size === size
    );


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      price: product.price,

      image: product.image,

      colour: product.colour,

      size: size,

      quantity: 1

    });

  }


  saveCart();

  updateBagCount();

  showToast(
    `${product.name} added to bag`
  );

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(
  productId,
  size
) {

  cart =
    cart.filter(
      item =>
        !(
          item.id === Number(productId) &&
          item.size === size
        )
    );


  saveCart();

  updateBagCount();

  renderCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
  productId,
  size,
  change
) {

  const item =
    cart.find(
      item =>
        item.id === Number(productId) &&
        item.size === size
    );


  if (!item) return;


  item.quantity += change;


  if (item.quantity <= 0) {

    removeFromCart(
      productId,
      size
    );

    return;

  }


  saveCart();

  updateBagCount();

  renderCart();

}


/* =========================================================
   CART TOTAL
========================================================= */

function cartSubtotal() {

  return cart.reduce(

    (total, item) =>

      total +
      item.price *
      item.quantity,

    0

  );

}


/* =========================================================
   SHIPPING
========================================================= */

function shippingCost() {

  const subtotal =
    cartSubtotal();

  if (subtotal === 0) return 0;

  if (subtotal >= 1999) return 0;

  return 99;

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  const container =
    document.getElementById("cartItems");

  if (!container) return;


  /* EMPTY CART */

  if (cart.length === 0) {

    container.innerHTML = `

      <div class="empty-cart">

        <p>
          YOUR BAG IS EMPTY.
        </p>

        <a
          href="shop.html"
          class="button button-dark"
        >
          EXPLORE THE COLLECTION ↗
        </a>

      </div>

    `;

    updateCartSummary();

    return;

  }


  container.innerHTML =
    cart.map(item => `

      <article class="cart-item">


        <img
          src="${item.image}"
          alt="${item.name}"
        >


        <div>

          <p class="eyebrow">
            ${item.colour}
          </p>


          <h3>
            ${item.name}
          </h3>


          <p>
            SIZE: ${item.size}
          </p>


          <div class="qty">

            <button
              onclick="changeQuantity(
                ${item.id},
                '${item.size}',
                -1
              )"
              aria-label="Decrease quantity"
            >
              −
            </button>


            <span>
              ${item.quantity}
            </span>


            <button
              onclick="changeQuantity(
                ${item.id},
                '${item.size}',
                1
              )"
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>


          <button
            class="remove"
            onclick="removeFromCart(
              ${item.id},
              '${item.size}'
            )"
          >
            REMOVE
          </button>

        </div>


        <div class="cart-price">

          ${formatPrice(
            item.price *
            item.quantity
          )}

        </div>


      </article>

    `).join("");


  updateCartSummary();

}


/* =========================================================
   UPDATE CART SUMMARY
========================================================= */

function updateCartSummary() {

  const subtotal =
    cartSubtotal();

  const shipping =
    shippingCost();

  const total =
    subtotal + shipping;


  const subtotalElement =
    document.getElementById(
      "cartSubtotal"
    );

  const shippingElement =
    document.getElementById(
      "cartShipping"
    );

  const totalElement =
    document.getElementById(
      "cartTotal"
    );


  if (subtotalElement) {

    subtotalElement.textContent =
      formatPrice(subtotal);

  }


  if (shippingElement) {

    shippingElement.textContent =
      shipping === 0
        ? "FREE"
        : formatPrice(shipping);

  }


  if (totalElement) {

    totalElement.textContent =
      formatPrice(total);

  }

}


/* =========================================================
   PRODUCT DETAIL PAGE
========================================================= */

function loadProductPage() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const productId =
    Number(
      params.get("id")
    );


  if (!productId) return;


  const product =
    products.find(
      product =>
        product.id === productId
    );


  if (!product) {

    document.body.innerHTML = `

      <main class="section-pad">

        <h1>
          PRODUCT NOT FOUND
        </h1>

        <a
          href="shop.html"
          class="button button-dark"
        >
          BACK TO SHOP
        </a>

      </main>

    `;

    return;

  }


  document.title =
    `${product.name} — NŌRE`;


  const image1 =
    document.getElementById(
      "productImage1"
    );

  const image2 =
    document.getElementById(
      "productImage2"
    );

  const image3 =
    document.getElementById(
      "productImage3"
    );

  const image4 =
    document.getElementById(
      "productImage4"
    );


  if (image1) {

    image1.src =
      product.image;

    image1.alt =
      product.name;

  }


  if (image2) {

    image2.src =
      product.image;

    image2.alt =
      product.name;

  }


  if (image3) {

    image3.src =
      product.image;

    image3.alt =
      product.name;

  }


  if (image4) {

    image4.src =
      product.image;

    image4.alt =
      product.name;

  }


  const name =
    document.getElementById(
      "productName"
    );


  const price =
    document.getElementById(
      "productPrice"
    );


  const colour =
    document.getElementById(
      "productColour"
    );


  const description =
    document.getElementById(
      "productDescription"
    );


  if (name)
    name.textContent =
      product.name;


  if (price)
    price.textContent =
      formatPrice(product.price);


  if (colour)
    colour.textContent =
      product.colour;


  if (description)
    description.textContent =
      product.description;


  /* SIZE BUTTONS */

  const sizeContainer =
    document.getElementById(
      "sizes"
    );


  if (sizeContainer) {

    sizeContainer.innerHTML =
      product.sizes.map(

        (size, index) => `

          <button
            type="button"
            class="size-btn ${
              index === 1
                ? "selected"
                : ""
            }"
            onclick="selectSize(this)"
            data-size="${size}"
          >
            ${size}
          </button>

        `

      ).join("");

  }


  /* ADD TO CART BUTTON */

  const addButton =
    document.getElementById(
      "addToCart"
    );


  if (addButton) {

    addButton.onclick =
      function () {

        const selected =
          document.querySelector(
            ".size-btn.selected"
          );


        const size =
          selected
            ? selected.dataset.size
            : product.sizes[0];


        addToCart(
          product.id,
          size
        );

      };

  }


  /* RELATED PRODUCTS */

  const related =
    document.getElementById(
      "relatedProducts"
    );


  if (related) {

    const relatedProducts =
      products
        .filter(
          item =>
            item.id !== product.id
        )
        .slice(0, 4);


    related.innerHTML =
      relatedProducts
        .map(productCard)
        .join("");

  }

}


/* =========================================================
   SIZE SELECTOR
========================================================= */

function selectSize(button) {

  document
    .querySelectorAll(".size-btn")
    .forEach(
      btn =>
        btn.classList.remove(
          "selected"
        )
    );


  button.classList.add(
    "selected"
  );

}


/* =========================================================
   SEARCH
========================================================= */

function searchProducts(query) {

  const search =
    query
      .trim()
      .toLowerCase();


  if (!search) {

    return products;

  }


  return products.filter(
    product =>

      product.name
        .toLowerCase()
        .includes(search)

      ||

      product.colour
        .toLowerCase()
        .includes(search)

      ||

      product.description
        .toLowerCase()
        .includes(search)

  );

}


/* =========================================================
   SEARCH FORM
========================================================= */

function setupSearch() {

  const form =
    document.getElementById(
      "searchForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const input =
        document.getElementById(
          "siteSearch"
        );


      if (!input) return;


      const query =
        input.value.trim();


      if (!query) return;


      window.location.href =
        `shop.html?search=${encodeURIComponent(
          query
        )}`;

    }
  );

}


/* =========================================================
   SHOP PAGE SEARCH
========================================================= */

function loadShopPage() {

  const container =
    document.getElementById(
      "shopProducts"
    );


  if (!container) return;


  const params =
    new URLSearchParams(
      window.location.search
    );


  const search =
    params.get("search");


  if (search) {

    const results =
      searchProducts(search);


    container.innerHTML =
      results.length

        ? results
            .map(productCard)
            .join("")

        : `

          <div class="empty-cart">

            <p>
              NO PIECES FOUND.
            </p>

            <a
              href="shop.html"
              class="text-link"
            >
              VIEW ALL PIECES ↗
            </a>

          </div>

        `;


    const searchTitle =
      document.getElementById(
        "shopSearchTitle"
      );


    if (searchTitle) {

      searchTitle.textContent =
        `SEARCH: ${search}`;

    }


  } else {

    container.innerHTML =
      products
        .map(productCard)
        .join("");

  }

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function filterProducts(
  category
) {

  const container =
    document.getElementById(
      "shopProducts"
    );


  if (!container) return;


  let filtered =
    products;


  if (category === "black") {

    filtered =
      products.filter(
        product =>
          product.colour
            .toLowerCase()
            .includes("black")
      );

  }


  if (category === "white") {

    filtered =
      products.filter(
        product =>
          product.colour
            .toLowerCase()
            .includes("white")
      );

  }


  if (category === "limited") {

    filtered =
      products.filter(
        product =>
          product.tag === "LIMITED"
      );

  }


  container.innerHTML =
    filtered
      .map(productCard)
      .join("");

}


/* =========================================================
   SORT PRODUCTS
========================================================= */

function sortProducts(
  method
) {

  const container =
    document.getElementById(
      "shopProducts"
    );


  if (!container) return;


  let sorted =
    [...products];


  if (method === "low") {

    sorted.sort(
      (a, b) =>
        a.price - b.price
    );

  }


  if (method === "high") {

    sorted.sort(
      (a, b) =>
        b.price - a.price
    );

  }


  if (method === "new") {

    sorted =
      [...products].reverse();

  }


  container.innerHTML =
    sorted
      .map(productCard)
      .join("");

}


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(message) {

  const existing =
    document.querySelector(
      ".toast"
    );


  if (existing) {

    existing.remove();

  }


  const toast =
    document.createElement(
      "div"
    );


  toast.className =
    "toast";


  toast.textContent =
    message;


  Object.assign(
    toast.style,
    {

      position: "fixed",

      left: "50%",

      bottom: "25px",

      transform:
        "translateX(-50%)",

      background: "#111",

      color: "#fff",

      padding:
        "14px 22px",

      fontSize: "10px",

      letterSpacing:
        ".12em",

      zIndex: "9999"

    }
  );


  document.body.appendChild(
    toast
  );


  setTimeout(
    () => {

      toast.remove();

    },
    2500
  );

}


/* =========================================================
   NEWSLETTER
========================================================= */

function subscribe(event) {

  event.preventDefault();


  const email =
    document.getElementById(
      "email"
    );


  const message =
    document.getElementById(
      "subscribeMsg"
    );


  if (!email || !message)
    return false;


  message.textContent =
    "YOU'RE ON THE LIST. WELCOME TO NŌRE.";


  email.value = "";


  return false;

}


/* =========================================================
   CHECKOUT
========================================================= */

function openCheckout() {

  if (cart.length === 0) {

    showToast(
      "YOUR BAG IS EMPTY"
    );

    return;

  }


  const modal =
    document.getElementById(
      "checkoutModal"
    );


  if (modal) {

    modal.style.display =
      "flex";

    document.body.style.overflow =
      "hidden";

  }

}


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

function closeCheckout() {

  const modal =
    document.getElementById(
      "checkoutModal"
    );


  if (modal) {

    modal.style.display =
      "none";

    document.body.style.overflow =
      "";

  }

}


/* =========================================================
   CHECKOUT FORM
========================================================= */

function submitOrder(event) {

  event.preventDefault();


  const form =
    event.target;


  const data =
    new FormData(form);


  const customerName =
    data.get("name");


  const orderNumber =
    "NORE-" +
    Date.now()
      .toString()
      .slice(-6);


  const modal =
    document.getElementById(
      "checkoutModal"
    );


  if (!modal) return false;


  modal.innerHTML = `

    <div class="modal-box success">

      <p class="eyebrow">
        ORDER CONFIRMED
      </p>


      <h2>
        THANK YOU
        ${customerName || ""}
      </h2>


      <p>
        Your order has been placed
        successfully.
      </p>


      <p>
        ORDER #${orderNumber}
      </p>


      <a
        href="index.html"
        class="button button-dark"
      >
        CONTINUE SHOPPING ↗
      </a>

    </div>

  `;


  cart = [];


  saveCart();

  updateBagCount();


  return false;

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

  const menuButton =
    document.querySelector(
      ".menu-toggle"
    );


  const nav =
    document.querySelector(
      ".desktop-nav"
    );


  if (!menuButton || !nav)
    return;


  menuButton.addEventListener(
    "click",
    function () {

      nav.classList.toggle(
        "mobile-open"
      );

    }
  );


  nav
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          nav.classList.remove(
            "mobile-open"
          );

        }
      );

    });

}


/* =========================================================
   SEARCH PANEL TOGGLE
========================================================= */

function setupSearchPanel() {

  const button =
    document.querySelector(
      ".search-toggle"
    );


  const panel =
    document.querySelector(
      ".search-panel"
    );


  if (!button || !panel)
    return;


  button.addEventListener(
    "click",
    function () {

      panel.classList.toggle(
        "open"
      );


      if (
        panel.classList.contains(
          "open"
        )
      ) {

        const input =
          document.getElementById(
            "siteSearch"
          );


        if (input) {

          setTimeout(
            () =>
              input.focus(),
            100
          );

        }

      }

    }
  );

}


/* =========================================================
   GLOBAL INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    updateBagCount();

    setupSearch();

    setupMobileMenu();

    setupSearchPanel();

    loadShopPage();

    loadProductPage();

    renderCart();

  }
);
