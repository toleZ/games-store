const productos = [];
const carrito = [];
const IVA = 1.21;

class Producto {
  constructor(nombre, stock, precio) {
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
  }
  precioConIVA() {
    return (this.precio * IVA).toFixed(2);
  }
  descontarStock(cant) {
    this.stock -= cant;
  }
}

productos.push(new Producto("Sniper Elite 5", randomStock(), 40));
productos.push(new Producto("Fifa 22", randomStock(), 65));
productos.push(new Producto("Assetto Corsa Competizione", randomStock(), 32));
productos.push(new Producto("Fallout 76", randomStock(), 15));

function listarProductos() {
  console.table(productos);
}

function agregarProducto() {
  let stock = randomStock();
  let nombre = prompt("Ingresa el nombre del producto");
  let precio = parseInt(prompt("Ingresa el precio del producto"));
  productos.push(new Producto(nombre, stock, precio));
  console.clear;
  listarProductos();
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
  let productoAbuscar = aux;
  for (const producto of productos) {
    if (producto.nombre == productoAbuscar) {
      if (producto.stock <= 0) {
        console.warn("No contamos con mas stock de este producto");
      } else {
        carrito.push(producto);
        producto.descontarStock(1);
        console.log("El producto", productoAbuscar, "se a agregado al carrito");
        break;
      }
    }
  }
}

function quitarDelcarrito(aux) {
  let productoAbuscar = aux;
  for (const producto of productos) {
    if (producto.nombre == productoAbuscar) {
      let indice = carrito.indexOf(productoAbuscar);
      carrito.splice(indice, 1);
      producto.descontarStock(-1);
      console.log("El producto", productoAbuscar, "se a eliminado del carrito");
      break;
    }
  }
}

function calcularTotal() {
  let totalCarrito = 0;
  for (const producto of carrito) {
    totalCarrito = totalCarrito + producto.precio * IVA;
  }
  console.log("El total es", totalCarrito.toFixed(2));
}

function randomStock() {
  return parseInt(Math.random() * 15);
}
