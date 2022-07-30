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
    this.precio = precio.toFixed(2);
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

const jsonProds = () => {
  fetch('./js/juegos.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(e => {
        productos.push(new Producto(e.nombre, randomStock(), 0, e.precio, e.img))
      })
    })
}
document.addEventListener("load", jsonProds())

const loginAlert = (user) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  fetch(`//api.github.com/users/${user.login}`)
    .then(response => response.json())
    .then(data => {
      if(!data.avatar_url){
        Toast.fire({
          icon: "success",
          title: `Bienvenido <span class="text-primary">${user.login}</span>`,
        });
      } else {
        Toast.fire({
          icon: "success",
          title: `Bienvenido <span class="text-primary">${user.login}</span><img src="${data.avatar_url}" class="mx-1" style="width: 25px; height: 25px;">`,
        });
      }
    })
    .catch(error => console.log(error))
}

const login = () => {
  Swal.fire({
    title: "Iniciar sesion",
    html: `<input type="email" id="login" class="swal2-input" placeholder="Email">
  <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
    confirmButtonText: "Ingresar",
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      const login = Swal.getPopup().querySelector("#login").value;
      const password = Swal.getPopup().querySelector("#password").value;
      if (!login || !password) {
        Swal.showValidationMessage(
          `Porfavor ingrese un nombre y contraseña validos`
        );
      }
      return { login: login, password: password };
    },
  }).then((result) => {
    const user = {
      login: result.value.login,
      password: result.value.password,
    };
    let str = JSON.stringify(user);
    localStorage.setItem("user", str);

    loginAlert(user)
  });
}

const singOut = () => {
  localStorage.removeItem('user')
  location.reload()
}

const loginConfirm = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  
  if(!user){
    login()
  } else {
    loginAlert(user)
  }
}
document.addEventListener("load", loginConfirm())

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
      if (producto.stock <= 0 || producto.cantidad == producto.stock) {
        Swal.fire({
          icon: "error",
          title: "No contamos con mas unidades de este producto",
        });
      } else {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success mx-1",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });

        swalWithBootstrapButtons
          .fire({
            title: "Confirmar",
            text: "Deseas agregar este pructo al carrito?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si, agregar!",
            cancelButtonText: "No, cancelar!",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "success",
                title: `<span class="text-success">${producto.nombre}</span> se ha agregado al carrito`,
              });
              const rst = carrito.some((e) => e.nombre === aux);
              if (rst == false) {
                producto.modificarCantidad(1);
                carrito.push(producto);
                sessionStorage.setItem("carrito", JSON.stringify(carrito));
              } else if (rst == true) {
                carrito.forEach((e) => {
                  if (e.nombre == producto.nombre) {
                    producto.modificarCantidad(1);
                    sessionStorage.removeItem(carrito);
                    sessionStorage.setItem("carrito", JSON.stringify(carrito));
                  }
                });
              }
              contadorDeItems();
              calcularTotal();
              llenarContenedor();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
          });
      }
    }
  }
}

function quitarDelcarrito(aux) {
  let productoAbuscar = aux;

  for (const producto of productos) {
    if (producto.nombre == productoAbuscar && producto.cantidad > 0) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-danger mx-1",
          cancelButton: "btn btn-success",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Confirmar",
          text: "Estas seguro que deseas eliminar este producto?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Si, eliminar!",
          cancelButtonText: "No, cancelar!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: `<span class="text-danger">${producto.nombre}</span> se ha eliminado del carrito`,
            });
            producto.modificarCantidad(-1);
            sessionStorage.removeItem(carrito);
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            contadorDeItems();
            calcularTotal();
            llenarContenedor();
          }
        });
    } else if (producto.nombre == productoAbuscar && producto.cantidad <= 0) {
      Swal.fire(
        "Error",
        "No tienes agregado este producto en tu carrito",
        "error"
      );
    }
  }
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

function vaciarCarrito() {
  for (let i = 0; i < carrito.length; i++) {
    carrito.pop();
  }
  productos.forEach((e) => {
    e.cantidad = 0;
  });
  contadorDeItems();
  calcularTotal();
  llenarContenedor();
}

const randomKey = () => {
  return (Math.random() + 1).toString(36).substring(7)
}

const keys = () => {
  carrito.forEach(e => {
      e.key = randomKey()
  })
}

const generarFactura = () => {
  keys()
  let factura = document.createElement('div')
  factura.innerHTML = "";
  for (prod of carrito) {
  let row = document.createElement("div");
  row.innerHTML = `
      <div class="row mx-0 my-2 py-2 border-3 border-bottom">
          <span class="col-6">
              <img src="${prod.img}" class="col-12 rounded"/>
          </span>
          <span class="col-6 align-center">
              <span class="col-12 align-center fs-4 text-black">${prod.nombre}</span>
              <br>
              <span class="col-12 fs-4">Key: ${prod.key}</span>
          </span>
      </div>
  `;
  factura.append(row);
  }
  Swal.fire({
      title: 'Compra completa con exito!',
      html: factura,
      showCloseButton: true,
      showConfirmButton: false,
      didClose: () => {location.reload()}
  })
}

function checkOut() {
  if (totalCarrito > 0) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-1",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Confirmar compra 🛒",
        text: "El total del carrito es $" + (totalCarrito * 1.21).toFixed(2),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "Compra completada con exito",
            });
            generarFactura()
          }, 3000);
          Swal.fire({
            title: preLoader(),
            text: "Completando compra...",
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        }
      });
  } else {
    Swal.fire(
      "El carrito esta vacio",
      "Debe haber minimo 1 producto en el carrito",
      "error"
    );
  }
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
  generarBtnsSuma();
  generarBtnsQuitar();
}
setTimeout(() => llenarContenedor(), 100)

function contadorDeItems() {
  itemsCounter.innerText = carrito.length;
}
contadorDeItems();

promoForm.addEventListener("submit", validateForm);
function validateForm(e) {
  e.preventDefault();
  if (promoCode.value == "supercode" && promoActive == false) {
    promoActive = true;
    Swal.fire({
      icon: "success",
      title: "Codigo correcto",
      text: "20% en toda la web!",
    });
    promoCode.value = "";
    for (producto of productos) {
      producto.precio = (producto.precio * 0.8).toFixed(2);
    }
    calcularTotal();
    llenarContenedor();
    for (let i = 0; i < promosPrice.length; i++) {
      promosPrice[i].classList.add("text-danger");
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Codigo incorrecto",
      text: "Ese codigo es incorrecto o ya ha sido utilizado por otro usuario",
    });
  }
}

function generarBtnsCheckOut() {
  let checkOutBtn = document.querySelector("#checkOutBtn");
  checkOutBtn.addEventListener("click", checkOut);
}
document.addEventListener("load", generarBtnsCheckOut());

function generarBtnsSuma() {
  const btnsSuma = [];

  productos.forEach((e) => {
    let btnName = e.nombre.replace(/ /g, "") + "btnSumar";
    let aux = document.getElementById(btnName);
    btnsSuma.push(aux);
  });

  for (let i = 0; i < btnsSuma.length; i++) {
    let btn = btnsSuma[i];
    let prod = productos[i].nombre;

    btn.addEventListener(
      "click",
      () => {
        sumarAlcarrito(prod);
      },
      false
    );
  }
}

function generarBtnsQuitar() {
  const btnsQuitar = [];
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

function preLoader() {
  return `
  <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
  </div>
`;
}

