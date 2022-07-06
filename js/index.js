const productos = [];
const carrito = [];
const IVA = 1.21;
let totalCarrito = 0;
let promoActive = false;

sessionStorage.clear();

const totalSpan = document.getElementById("totalSpan");
const ivaSpan = document.getElementById("ivaSpan");
const subtotalSpan = document.getElementById("subtotalSpan");
const productsContainer = document.getElementById("productsContainer");
const itemsCounter = document.getElementById("itemsCounter");
const promoForm = document.getElementById("promoForm");
const promoCode = document.getElementById("promoCode");
const applyBtn = document.getElementById("applyBtn");

const promosPrice = document.getElementsByClassName("promoClass");

class Producto {
  constructor(nombre, stock, cantidad, precio, img) {
    this.nombre = nombre;
    this.stock = stock;
    this.cantidad = cantidad;
    this.precio = precio;
    this.img = img;
  }
  precioConIVA() {
    return (this.precio * IVA).toFixed(2);
  }
  modificarCantidad(cant) {
    switch (cant) {
      case 1:
        if (this.cantidad < this.stock) {
          this.cantidad++;
        } else if (this.cantidad > this.stock) {
          this.cantidad == this.stock;
        }
        break;
      case -1:
        if (this.cantidad > 0) {
          this.cantidad--;
        }
        break;
    }
  }
}

productos.push(
  new Producto(
    "Sniper Elite 5",
    randomStock(),
    0,
    40,
    "https://store-images.s-microsoft.com/image/apps.47890.14595554922816019.13efe6e8-ecc1-4d7d-95f8-56ec07d2ff6a.119cf61c-4514-4fa3-a503-8f973e85e7ac?mode=scale&q=90&h=300&w=200&background=%23FFFFFF"
  )
);
productos.push(
  new Producto(
    "Fifa 22",
    randomStock(),
    0,
    65,
    "https://m.media-amazon.com/images/I/61Kda+eUmlL._SL1000_.jpg"
  )
);
productos.push(
  new Producto(
    "Assetto Corsa Competizione",
    randomStock(),
    0,
    32,
    "https://www.almadigitales.net/wp-content/uploads/2021/12/logitech-g923-racing-wheel-and-pedals-assetto-corsa-competizione-ps4-games-bundle.jpg"
  )
);
productos.push(
  new Producto(
    "Fallout 76",
    randomStock(),
    0,
    15,
    "https://store-images.s-microsoft.com/image/apps.14694.70143269474194625.34cbed60-6333-4a42-8ea0-c20f5ac7373a.b931a0ac-1e27-4a23-b329-c621d5151355"
  )
);

function listarProductos() {
  console.clear();
  console.table(productos);
}

function agregarProducto() {
  let stock = randomStock();
  let nombre = prompt("Ingresa el nombre del producto");
  let precio = parseInt(prompt("Ingresa el precio del producto"));
  let img = prompt("Ingresa el link de la img del producto");
  productos.push(new Producto(nombre, stock, 0, precio, img));
  console.clear;
  listarProductos();
  llenarContenedor();
}

function buscarProducto() {
  let productoAbuscar = prompt("Ingrese el producto");
  for (const producto of productos) {
    if (producto.nombre == productoAbuscar) {
      console.log("Producto encontrado");
      break;
    }
  }
}

function sumarAlcarrito(aux) {
  for (const producto of productos) {
    if (producto.nombre == aux) {
      if (producto.stock <= 0) {
        alert("No contamos con mas stock de este producto");
        console.warn("Producto fuera de stock");
      } else {
        const rst = carrito.some((e) => e.nombre === aux);
        if (rst == false) {
          producto.modificarCantidad(1);
          carrito.push(producto);
          sessionStorage.setItem(producto.nombre, JSON.stringify(producto));
        } else if (rst == true) {
          carrito.forEach((e) => {
            if (e.nombre == producto.nombre) {
              producto.modificarCantidad(1);
              sessionStorage.removeItem(producto.nombre);
              sessionStorage.setItem(producto.nombre, JSON.stringify(producto));
            }
          });
        }
        contadorDeItems();
        calcularTotal();
        llenarContenedor();
      }
    }
  }
}

function quitarDelcarrito(aux) {
  let productoAbuscar = aux;
  for (const producto of productos) {
    if (producto.nombre == productoAbuscar) {
      producto.modificarCantidad(-1);
      sessionStorage.removeItem(producto.nombre);
      sessionStorage.setItem(producto.nombre, JSON.stringify(producto));
    }
  }
  contadorDeItems();
  calcularTotal();
  llenarContenedor();
}

function verificarCarrito() {
  carrito.forEach((e) => {
    if (e.cantidad == 0) {
      const i = carrito.indexOf(e);
      carrito.splice(i, 1);
      sessionStorage.removeItem(e.nombre);
    }
  });
}

function calcularTotal() {
  verificarCarrito();
  totalCarrito = 0;
  for (producto of carrito) {
    totalCarrito += producto.cantidad * producto.precio;
  }
  if (carrito.length == 0) {
    totalCarrito = 0;
  }
  subtotalSpan.innerHTML = totalCarrito.toFixed(2);
  totalSpan.innerHTML = (totalCarrito * IVA).toFixed(2);
  ivaSpan.innerHTML = (totalCarrito * 0.21).toFixed(2);
}

function calcularCarrito() {
  productosEnCarrito = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    let item = sessionStorage.key(i);
    if (item != "IsThisFirstTime_Log_From_LiveServer") {
      productosEnCarrito.push(item);
    }
  }
  console.table(productosEnCarrito);
}

function randomStock() {
  return parseInt(Math.random() * 15);
}

function llenarContenedor() {
  productsContainer.innerHTML = "";
  for (prod of productos) {
    let row = document.createElement("div");
    row.innerHTML = `<div class="row m-0 border-top">
          <span class="col-5">
            <span class="col-12 row py-2">
              <div class="col-lg-6">
                <img
                  src="${prod.img}"
                  class="col-12 rounded mw-100 mh-100"
                  style="width: 220px; height: 260px"
                />
              </div>
              <div class="col-lg-6 ps-lg-0 ps-md-3 d-flex flex-column">
                <span class="align-top fs-4 text-black">${prod.nombre}</span>
                <span class="align-top fs-6text-secondary mw-100"
                  >PS4</span
                >
              </div>
            </span>
          </span>

          <span class="col-3 text-center py-4 fs-6 promoClass"> $ ${
            prod.precio
          }  </span>
          <span class="col-3 text-center py-4 fs-6">
            <span>${prod.cantidad}<span class="mx-3">/</span>${
      prod.stock
    }</span>
          </span>
          <span class="col-1 text-center py-4 fs-6">
            <button
              onclick="sumarAlcarrito('${prod.nombre}')"
              class="border-0 bg-transparent"
              id="${prod.nombre.replace(/ /g, "") + "btnSumar"}"
            >
              <span class="jam jam-plus"></span>
            </button>
            <button
              onclick="quitarDelcarrito('${prod.nombre}')"
              class="border-0 bg-transparent"
              id="${prod.nombre.replace(/ /g, "") + "btnQuitar"}"
            >
              <span class="jam jam-trash"></span>
            </button>
          </span>
        </div>`;
    productsContainer.append(row);
    if (promoActive == true) {
      for (let i = 0; i < promosPrice.length; i++) {
        promosPrice[i].classList.add("text-danger");
      }
    }
  }
}
llenarContenedor();

function contadorDeItems() {
  let i = 0;
  carrito.forEach((e) => {
    i = i + e.cantidad;
  });
  itemsCounter.innerText = i;
}
contadorDeItems();

promoForm.addEventListener("submit", validateForm);
function validateForm(e) {
  e.preventDefault();
  if (promoCode.value == "code" && promoActive == false) {
    promoActive = true;
    for (producto of productos) {
      producto.precio = (producto.precio * 0.8).toFixed(2);
    }
    calcularTotal();
    llenarContenedor();
    for (let i = 0; i < promosPrice.length; i++) {
      promosPrice[i].classList.add("text-danger");
    }
  }
}

/* 
const btnsSuma = [];
function generarBtnsSuma() {
  productos.forEach((e) => {
    let btnName = e.nombre.replace(/ /g, "") + "btnSumar";
    let aux = document.getElementById(btnName);
    btnsSuma.push(aux);
  });

  for (let i = 0; i < btnsSuma.length; i++) {
    let btn = btnsSuma[i];
    let prod = productos[i].nombre;

    btn.addEventListener("click", () => {
      sumarAlcarrito(prod);
    });
  }
}
generarBtnsSuma();

const btnsQuitar = [];
function generarBtnsQuitar() {
  productos.forEach((e) => {
    let btnName = e.nombre.replace(/ /g, "") + "btnQuitar";
    let aux = document.getElementById(btnName);
    btnsQuitar.push(aux);
  });

  for (let i = 0; i < btnsQuitar.length; i++) {
    let btn = btnsQuitar[i];
    let prod = productos[i].nombre;

    btn.addEventListener("click", () => {
      quitarDelcarrito(prod);
    });
  }
}
generarBtnsQuitar(); 
*/
