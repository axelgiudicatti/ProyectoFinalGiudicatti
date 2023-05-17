/*                                          VARIABLES Y FUNCIONES NECESARIAS. OBJETOS, CONSTRUCTORES, CLASES, METODOS. ARRAYS DE OBJETOS */
let total = 0;
let cantidadtotal = 0;
let carrito = [];

let carritoJS = JSON.parse(localStorage.getItem("birras")) ?? [
  { cantidad: 0 },
  { cantidad: 0 },
  { cantidad: 0 },
  { cantidad: 0 },
];

class Cerveza {
  constructor(estilo, precio, cantidad, stock) {
    this.estilo = estilo;
    this.precio = parseFloat(precio);
    this.cantidad = parseFloat(cantidad);
    this.subtotal = this.precio * this.cantidad;
    this.stock = stock;
  }
  agregaritem(cantidadaagregar) {
    this.cantidad = this.cantidad + cantidadaagregar;
    this.subtotal = this.precio * this.cantidad;
    this.stock = this.stock - cantidadaagregar;
  }
  eliminaritem(cantidadaeliminar) {
    this.cantidad = this.cantidad - cantidadaeliminar;
    this.subtotal = this.precio * this.cantidad;
    this.stock = this.stock + cantidadaeliminar;
  }
}

function calculartotales(carrito2) {
  total = 0;
  cantidadtotal = 0;
  carrito2.forEach((cart) => {
    total += cart.subtotal;
    cantidadtotal += cart.cantidad;
  });
}

const pagocredito = () => {
  let tarjeta = document.querySelector("#envios");
  tarjeta.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.clear();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Tu pedido ha sido confirmado. En breve serás redireccionado",
      showConfirmButton: false,
      timer: 2000,
    });
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 2200);
  });
};
const pagomp = (x, y) => {
  let mpzone = document.querySelector(x);
  mpzone.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Tu pedido ha sido confirmado. En breve serás redireccionado",
      showConfirmButton: false,
      timer: 2000,
    });
    setTimeout(function () {
      window.location.href = y;
    }, 2200);
  });
};

const totalCarrito = ({ estilo, precio, cantidad }) => {
  let endorder = document.querySelector("#totalcarrito");
  endorder.innerHTML =
    `<h2> El total de tu compra es ` +
    total +
    ` y te llevas ` +
    cantidadtotal +
    ` latas </h2>`;
};

const cerves = async () => {
  try {
    const resp = await fetch("../productos.json");
    const productos = await resp.json();
    let carrito2 = [];
    productos.forEach((producto) => {
      carrito2.push(
        new Cerveza(
          producto.estilo,
          producto.precio,
          producto.cantidad,
          producto.stock
        )
      );
    });
    for (let ind = 0; ind < carrito2.length; ind++) {
      carrito2[ind].agregaritem(carritoJS[ind].cantidad);
    }
    calculartotales(carrito2);
    carrito2.forEach((item) => {
      totalCarrito(item);
    });
  } catch (error) {}
};

/*                                           RUNNER                                        */
cerves();
pagocredito();
pagomp("#mercadopago", "https://www.mercadopago.com.ar/");
pagomp("#pagar", "../index.html");
