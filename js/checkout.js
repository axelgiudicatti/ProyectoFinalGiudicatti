/*                                          VARIABLES Y FUNCIONES NECESARIAS. OBJETOS, CONSTRUCTORES, CLASES, METODOS. ARRAYS DE OBJETOS */
let total = 0;
let cantidadtotal = 0;
let ordenes = [];
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

sucursales = [
  { Localidad: "ESPERANZA", Direccion: "Aufranc 2043", Horario: "9 a 19" },
  {
    Localidad: "SANTA FE",
    Direccion: "Bv. Pellegrini 2495",
    Horario: "10 a 21",
  },
  { Localidad: "CABA", Direccion: "Viamonte 2358", Horario: "9 a 21" },
  { Localidad: "MENDOZA", Direccion: "25 de Mayo 3561", Horario: "10 a 18" },
  { Localidad: "EL CHALTEN", Direccion: "Monte Fitz Roy", Horario: "8 a 20" },
  { Localidad: "USHUAIA", Direccion: "San martin 2165", Horario: "9 a 17" },
  { Localidad: "ROSARIO", Direccion: "Bv orono 1354", Horario: "9 a 19" },
  {
    Localidad: "VILLA GENERAL BELGRANO",
    Direccion: "San Martin 458",
    Horario: "9 a 19",
  },
  { Localidad: "BARILOCHE", Direccion: "1 de mayo 257", Horario: "9 a 17" },
];

function calculartotales(carrito2) {
  total = 0;
  cantidadtotal = 0;
  carrito2.forEach((cart) => {
    total += cart.subtotal;
    cantidadtotal += cart.cantidad;
  });
}

const verCarrito = ({ estilo, precio, cantidad }) => {
  let indexorder = document.querySelector("#carritoindex");
  indexorder.innerHTML = `<h2> Checkout </h2>`;
  let endorder = document.querySelector("#totalcarrito");
  endorder.innerHTML =
    `<h2> El total de tu compra es ` +
    total +
    ` y te llevas ` +
    cantidadtotal +
    ` latas </h2>`;
  let carritodiv = document.getElementById(`carrito${estilo}`);
  carritodiv.className = "carrito checkout";
  carritodiv.innerHTML = `
        <img src="../imgs/${estilo}.webp.png" class="carritoimg" />
        <h4>${estilo}</h4>
        <h4>$${precio}/lata</h4>
        <button class="color--state-bad mini" id="eliminar1${estilo}"
        ><strong>-</strong></button>
        <h5>${cantidad} unidades</h5>
        <button class="color--state-ok mini" id="agregar1${estilo}"
        ><strong>+</strong></button>
        <h4>Subt. $${cantidad * precio} </h4>
      </div>`;
};

let eliminador1 = (CARRO, carrito2) => {
  let eliminar = document.querySelector("#eliminar1" + CARRO.estilo);
  eliminar.addEventListener("click", (e) => {
    e.preventDefault();
    if (1 <= CARRO.cantidad) {
      CARRO.eliminaritem(1);
      calculartotales(carrito2);
      verCarrito(CARRO);
      eliminador1(CARRO, carrito2);
      agregardor1(CARRO, carrito2);
      localStorage.setItem("birras", JSON.stringify(carrito2));
    }
  });
};

let agregardor1 = (CARRO, carrito2) => {
  let agregar1 = document.querySelector("#agregar1" + CARRO.estilo);
  agregar1.addEventListener("click", (e) => {
    e.preventDefault();
    if (1 <= CARRO.stock) {
      CARRO.agregaritem(1);
      calculartotales(carrito2);
      verCarrito(CARRO);
      eliminador1(CARRO, carrito2);
      agregardor1(CARRO, carrito2);
      localStorage.setItem("birras", JSON.stringify(carrito2));
    } else {
      Swal.fire({
        icon: "error",
        text: "No hay stock suficiente. Stock disponible" + " " + CARRO.stock,
        color: `black`,
        confirmButtonColor: `#2b8b34`,
      });
    }
  });
};

const retirar = ({ Localidad, Direccion, Horario }) => {
  let entrega = document.querySelector("#sucursales");
  const newselect = document.createElement("option");
  newselect.innerHTML = `Localidad: ${Localidad}. Dirección: ${Direccion}. Horarios: ${Horario}`;
  entrega.append(newselect);
};

const crearordenenvio = () => {
  let region = document.querySelector("#envios");
  region.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "../pages/pay.html";
  });
};

const crearordenretiro = () => {
  let region = document.querySelector("#retiro");
  region.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "../pages/pay.html";
  });
};

const vaciar = (CARRO, carrito2) => {
  let boton = document.querySelector("#vaciar");
  boton.addEventListener("click", (e) => {
    e.preventDefault();
    carrito2.forEach((producto) => {
      producto.cantidad = 0;
      producto.subtotal = 0;
    });

    localStorage.setItem("birras", JSON.stringify(carrito2));
    calculartotales(carrito2);
    verCarrito(CARRO);
    eliminador1(CARRO, carrito2);
    agregardor1(CARRO, carrito2);
  });
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
      vaciar(item, carrito2);
      verCarrito(item);
      eliminador1(item, carrito2);
      agregardor1(item, carrito2);
      crearordenenvio();
      crearordenretiro();
    });
  } catch (error) {}
};

/*                                           RUNNER                                        */

sucursales.forEach((sucursal) => {
  retirar(sucursal);
});

cerves(); /*
carrito.forEach((item) => {
  verCarrito(item);
  eliminador1(item);
  agregardor1(item);
}); /*
crearordenenvio();
crearordenretiro();*/
