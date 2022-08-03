const productos = [];
const carrito = [];
const IVA = 1.21;
let totalCarrito = 0;
let promoActive = false;

sessionStorage.clear(); //Lo utilizo para borrar el dato que almacena LiveServer

const totalSpan = document.getElementById("totalSpan");
const ivaSpan = document.getElementById("ivaSpan");
const subtotalSpan = document.getElementById("subtotalSpan");
const productsContainer = document.getElementById("productsContainer");
const itemsCounter = document.getElementById("itemsCounter");
const promoForm = document.getElementById("promoForm");
const promoCode = document.getElementById("promoCode");
const applyBtn = document.getElementById("applyBtn");
const promosPrice = document.getElementsByClassName("promoClass");
const searchInput = document.querySelector('#searchInput')
const searchForm = document.querySelector('#searchForm')
const prodName = document.querySelector('#prodName')
const prodPrice = document.querySelector('#prodPrice')
const prodNameArrow = document.querySelector('#prodNameArrow')
const prodPriceArrow = document.querySelector('#prodPriceArrow')
const singOutBtn = document.querySelector('#singOutBtn')

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

const llenarContenedor = (arr) => {
  productsContainer.innerHTML = "";
  for (prod of arr) {
    let row = document.createElement("div");
    row.id = `${prod.nombre.replace(/ /g, "") + "container"}`
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
  generarBtnsSuma(arr);
  generarBtnsQuitar(arr);
  generarHovers(arr)
}

const getProds = () => {
  const URL = 'https://62e5659ede23e263791fca7e.mockapi.io/juegos'
  //const URl = './js/juegos.json'

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      data.forEach(e => {
        productos.push(new Producto(e.nombre, randomStock(), 0, e.precio, e.img))
      })
    })
    .catch(error => console.log(error))
    .finally(() => {
      llenarContenedor(productos)
    })
}
document.addEventListener("load", getProds())

const postProd = (prod) => {
  fetch('https://62e5659ede23e263791fca7e.mockapi.io/juegos',{
    method:'POST',
    body:JSON.stringify(prod),
    headers:{
      'Content-type':'application/json'
    }
  })
    .then(response => console.log(response.json))
    .finally(() => llenarContenedor(productos))
}

const loginAlert = async (user) => {
  const URL = `//api.github.com/users/${user.login}`
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const alertSinImg = Toast.fire({
    icon: "success",
    title: `Bienvenido <span class="text-primary">${user.login}</span>`,
  });
  const alertConImg = (data) => {
    return Toast.fire({
      icon: "success",
      title: `Bienvenid@ <span class="text-primary">${user.login}</span><img src="${data.avatar_url}" class="mx-1" style="width: 25px; height: 25px;">`,
    });
  }

  fetch(URL)
    .then(response => response.json())
    .then(data => !data.avatar_url ? alertSinImg : alertConImg(data))
    .catch(error => console.log(error))
}

const login = () => {
  Swal.fire({
    title: "Iniciar sesion",
    html: `
      <input type="email" id="email" class="swal2-input" placeholder="Email">
      <input type="text" id="login" class="swal2-input" placeholder="Usuario">
      <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
    `,
    confirmButtonText: "Ingresar",
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#email").value;
      const login = Swal.getPopup().querySelector("#login").value;
      const password = Swal.getPopup().querySelector("#password").value;
      if (!login || !password || !email) {
        Swal.showValidationMessage(
          `Porfavor ingrese datos validos`
        );
      }
      return { email: email, login: login, password: password };
    },
  }).then((result) => {
    const user = {
      email: result.value.email,
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
singOutBtn.addEventListener('click', singOut)

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

const buscarProducto = (e) => {
  e.preventDefault()

  const productosEncontrados = productos.filter(ele => ele.nombre.toLowerCase().includes(searchInput.value.toLowerCase()))

  if(searchInput.value != ''){
    llenarContenedor(productosEncontrados)
  } else {
    llenarContenedor(productos)
  }
}
searchForm.addEventListener('submit', buscarProducto)

function agregarProducto() {
  let stock = randomStock();
  let nombre = prompt("Ingresa el nombre del producto");
  let precio = parseInt(prompt("Ingresa el precio del producto"));
  let img = prompt("Ingresa el link de la img del producto");
  const prod = {
    'nombre': nombre,
    'precio': precio,
    'img': img
  }
  productos.push(new Producto(nombre, stock, 0, precio, img));
  postProd(prod)
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
              llenarContenedor(productos);
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
            llenarContenedor(productos);
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
            generarFactura()
          }, 3000);
          Swal.fire({
            title: preLoader(),
            text: "Confirmando compra...",
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
    llenarContenedor(productos);
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

function generarBtnsSuma(arr) {
  const btnsSuma = [];

  arr.forEach((e) => {
    let btnName = e.nombre.replace(/ /g, "") + "btnSumar";
    let aux = document.getElementById(btnName);
    btnsSuma.push(aux);
  });

  for (let i = 0; i < btnsSuma.length; i++) {
    let btn = btnsSuma[i];
    let prod = arr[i].nombre;

    btn.addEventListener(
      "click",
      () => {
        sumarAlcarrito(prod);
      },
      false
    );
  }
}

function generarBtnsQuitar(arr) {
  const btnsQuitar = [];
  arr.forEach((e) => {
    let btnName = e.nombre.replace(/ /g, "") + "btnQuitar";
    let aux = document.getElementById(btnName);
    btnsQuitar.push(aux);
  });

  for (let i = 0; i < btnsQuitar.length; i++) {
    let btn = btnsQuitar[i];
    let prod = arr[i].nombre;

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

const prodNameOrder = () => {
  if(prodNameArrow.classList == "jam jam-arrow-up"){
    prodNameArrow.classList = "jam jam-arrow-down"
    prodPriceArrow.classList = "jam jam-arrow-up"
    productosOrdenados = productos.sort((a, b) => {
      if(a.nombre < b.nombre){
        return 1
      }
      if(a.nombre > b.nombre){
        return -1
      }
      return 0
    })
    llenarContenedor(productosOrdenados)
  } else if(prodNameArrow.classList == "jam jam-arrow-down"){
    prodNameArrow.classList = "jam jam-arrow-up"
    productosOrdenados = productos.sort((a, b) => {
      if(a.nombre < b.nombre){
        return -1
      }
      if(a.nombre > b.nombre){
        return 1
      }
      return 0
    })
    llenarContenedor(productosOrdenados)
  }
  
}
prodName.addEventListener('click', prodNameOrder)

const prodPriceOrder = () => {
  if(prodPriceArrow.classList == "jam jam-arrow-up"){
    prodPriceArrow.classList = "jam jam-arrow-down"
    prodNameArrow.classList = "jam jam-arrow-up"
    productosOrdenados = productos.sort((a, b) => {
      if(a.precio > b.precio){
        return 1
      }
      if(a.precio < b.precio){
        return -1
      }
      return 0
    })
  } else if (prodPriceArrow.classList == "jam jam-arrow-down"){
    prodPriceArrow.classList = "jam jam-arrow-up"
    productosOrdenados = productos.sort((a, b) => {
      if(a.precio > b.precio){
        return -1
      }
      if(a.precio < b.precio){
        return 1
      }
      return 0
    })
  }
  llenarContenedor(productosOrdenados)
}
prodPrice.addEventListener('click', prodPriceOrder)

const generarHovers = (arr) => {
  arr.forEach(e => {
    let prodContainerId = e.nombre.replace(/ /g, "") + "container";
    let prod = document.getElementById(prodContainerId)
    prod.addEventListener('mouseover',() => {prod.classList.add("border-2", "border-start", "border-end", "border-info")})
    prod.addEventListener('mouseout',() => {prod.classList.remove("border-2", "border-start", "border-end", "border-info")})
  })
}