/*                                          VARIABLES Y FUNCIONES NECESARIAS. OBJETOS, CONSTRUCTORES, CLASES, METODOS. ARRAYS DE OBJETOS */

let total = 0;
let cantidadtotal = 0;
let carrito2 = [];

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

const calculartotales = (carrito2) => {
  total = 0;
  cantidadtotal = 0;
  carrito2.forEach((cart) => {
    total += cart.subtotal;
    cantidadtotal += cart.cantidad;
  });
};
const agregadora = (CARRO, carrito2) => {
  let agregar = document.querySelector("#agregar" + CARRO.estilo);
  agregar.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      (parseInt(e.target.children["cantidad"].value) <= CARRO.stock) &
      (parseInt(e.target.children["cantidad"].value) > 0)
    ) {
      CARRO.agregaritem(parseInt(e.target.children["cantidad"].value));
      calculartotales(carrito2);
      localStorage.setItem("birras", JSON.stringify(carrito2));
      verCarrito(CARRO);
    } else if (e.target.children["cantidad"].value <= 0) {
      Swal.fire({
        icon: "error",
        text: "Ingrese un número válido mayor a cero.",
        color: `black`,
        confirmButtonColor: `#2b8b34`,
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "No hay stock suficiente. Stock disponible" + " " + CARRO.stock,
        color: `black`,
        confirmButtonColor: `#2b8b34`,
      });
    }
    agregar.reset();
  });
};

const verCarrito = ({ estilo, precio, cantidad }) => {
  let indexorder = document.querySelector("#carritoindex");
  indexorder.innerHTML = `<h2> Tu carrito de compras </h2>`;
  let endorder = document.querySelector("#totalcarrito");
  endorder.innerHTML =
    `<h2> El total de tu compra es ` +
    total +
    ` y te llevas ` +
    cantidadtotal +
    ` latas </h2>
    <form action="pages/checkout.html">
    <button type="submit" class="modify color--state-ok pagar"> Ir a Checkout </button>
    </form> `;
  let carrito = document.getElementById(`carrito${estilo}`);
  carrito.className = "carrito";
  carrito.innerHTML = `
        <img src="imgs/${estilo}.webp.png" class="carritoimg" />
        <h3>${estilo}</h3>
        <h4>$${precio}/lata</h4>
        <h4>${cantidad} unidades</h4>
        <h4>Subt. $${cantidad * precio} </h4>
      </div>`;
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
      agregadora(item, carrito2);
      verCarrito(item, carrito2);
    });
  } catch (error) {}
};

/*                                           RUNNER                                        */

cerves();
