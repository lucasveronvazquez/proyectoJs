
//---------------------arrays vacios de stock y productos en el carrito----------------//
let productosJSON=[];

let carrito = [];

//-------------------------------------------------------------------------------------//

const contenedorProductos = document.getElementById('contenedor-productos');

const contenedorCarrito = document.getElementById('carrito-contenedor');

const botonVaciar = document.getElementById('vaciar-carrito');

const botonTerminarCompra = document.getElementById('terminar-compra');

const contadorCarrito = document.getElementById('contadorCarrito');


const cantidad = document.getElementById('cantidad');

const precioTotal = document.getElementById('precioTotal');

const cantidadTotal = document.getElementById('cantidadTotal');


//----------------------------------------eventos----------------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        
        actualizarCarrito()
    }
});

botonVaciar.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
});


    botonTerminarCompra.addEventListener('click', async () => {
        const { value: email } = await Swal.fire({
            title: 'ingrese su email',
            input: 'email',
            inputLabel: 'le enviaremos un correo para terminar la compra',
            inputPlaceholder: 'ejemplo@gmail.com'
          })
          
          if (email) {
            Swal.fire(`correo enviado a: ${email}`)
          }
          carrito.length = 0;
          actualizarCarrito();
});

const agregarAlCarrito = (prodId) => {

   
    const existe = carrito.some (producto => producto.id === prodId) 

    if (existe){ 
        const prod = carrito.map (prod => { 
            if (prod.id === prodId){
                prod.cantidad++
                
            }
        })
    } else { 
        const item = productosJSON.find((producto) => producto.id === prodId)
        carrito.push(item)
        
    };
    
    

    actualizarCarrito() 
}

const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId);

    const indice = carrito.indexOf(item);

    carrito.splice(indice, 1) ;

    actualizarCarrito() ;

}

const actualizarCarrito = () => {
    
    contenedorCarrito.innerHTML = ""; 

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div);
        
        localStorage.setItem('carrito', JSON.stringify(carrito));

    })
    
    contadorCarrito.innerText = carrito.length ;
    
    
    precioTotal.innerText = carrito.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0);
    
}



//------------------------botón tema dark-light---------------------------------------------------//

const botonSwitch = document.querySelector('#switch');


botonSwitch.addEventListener('click', () => {
document.body.classList.toggle('dark');
botonSwitch.classList.toggle('active');


document.body.classList.contains('dark') ? localStorage.setItem('dark-mode', 'true' ) : localStorage.setItem('dark-mode', 'false' )
 
})

if (localStorage.getItem('dark-mode')=== 'true')  {

    document.body.classList.add('dark'); 
    botonSwitch.classList.add('active');

}else{ 
    document.body.classList.remove('dark');
    botonSwitch.classList.remove('active');
 };
//---------------------------------------------------------------------------------------------------------//

//---------------------------------tomamos stock desde JSON-----------------------------------//
 async function obtenerJSON(){
    const URLJSON="productos.json";
    const resp = await fetch(URLJSON)
    const data = await resp.json()
    productosJSON=data;
    renderizarProductos();

   }


   obtenerJSON();

//--------------------------------------------dibujando productos en html ---------------------------//

   function renderizarProductos(){

    productosJSON.forEach(producto => {
          const div = document.createElement('div');
          div.classList.add("row");
          div.innerHTML = `
          <div class="card m-3 p-3" style= "width: 18rem;">
                <img class="card-img-top" src="${producto.foto}">
                <div class="card-body">
                      <h5>"${producto.nombre}"</h5>
                      <p>$${producto.precio}</p>
                      <p>ID : ${producto.id}</p>
                      <btn id='btn${producto.id}'class="btn btn-outline-danger">Agregar <i class="fa-solid fa-cart-shopping"></i></btn>
                
                </div>
                </div>
          `
         contenedorProductos.appendChild(div)
    
         const boton = document.getElementById(`btn${producto.id}`);
         boton.addEventListener('click', () => {
          agregarAlCarrito(producto.id);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${producto.nombre} Agregado al Carrito`,
            showConfirmButton: false,
            timer: 1000
          });
         })
    })
     
     
    }

    //---------------------------------------modal-contenedor--------------------------------//
    const contenedorModal = document.getElementsByClassName('modal-contenedor')[0];
    const botonAbrir = document.getElementById('boton-carrito');
    const botonCerrar = document.getElementById('carritoCerrar');
    const modalCarrito = document.getElementsByClassName('modal-carrito')[0];


    botonAbrir.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active');
    })
    botonCerrar.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active');
    })

    contenedorModal.addEventListener('click', (event) =>{
    contenedorModal.classList.toggle('modal-active');

   })
   modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation() ;

   });

   //-------------------------------------------------------------------------------------//