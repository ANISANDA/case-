class Product {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
  }
}

class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
  }
  add(product) {
    const item = this.items.find((p) => p.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
  }
  update(id, quantity) {
    const item = this.items.find((p) => p.id === id);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) this.remove(id);
    }
    this.save();
  }
  remove(id) {
    this.items = this.items.filter((p) => p.id !== id);
    this.save();
  }
  clear() {
    this.items = [];
    this.save();
  }
  save() {
    localStorage.setItem("cart", JSON.stringify(this.items));
    renderCart();
  }
}

let products = JSON.parse(localStorage.getItem("products")) || [];
const cart = new Cart();

function addProduct() {
  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const image =
    document.getElementById("image").value || "https://via.placeholder.com/150";

  if (!name || !price) return alert("Nhập đầy đủ thông tin!");

  const newProduct = new Product(Date.now(), name, price, image);
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach((p) => {
    list.innerHTML += `
          <div class="product">
            <img src="${p.image}">
            <div>
              <b>${p.name}</b><br>
              ${p.price.toLocaleString()}đ
            </div>
            <button class="cart" onclick='cart.add(${JSON.stringify(
              p
            )});'>🛒</button>
            <button class="delete" onclick="deleteProduct(${p.id})">x</button>
          </div>
        `;
  });
}

function renderCart() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  cart.items.forEach((item) => {
    list.innerHTML += `
          <div class="cart-item">
            <img src="${item.image}">
            <div>
              <b>${item.name}</b><br>
              ${item.price.toLocaleString()}đ 
              <input type="number" value="${item.quantity}" min="1"
               onchange="cart.update(${item.id}, this.value)">
            </div>
            <button class="delete" onclick="cart.remove(${item.id})">x</button>
          </div>
        `;
  });
}

renderProducts();
renderCart();
