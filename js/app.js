(() => {

    const formulario          = document.querySelector('#formulario'),
          criptomonedasOption = document.querySelector('#criptomonedas'),
          monedaSelect        = document.querySelector('#moneda'),
          criptoSelect        = document.querySelector('#criptomonedas'),
          resultado           = document.querySelector('#resultado');
    
    let objBusqueda = {
        moneda: '',
        criptomoneda: ''
    }
    
    document.addEventListener( 'DOMContentLoaded', () => {
    
        consultarMonedasTop();
        
        formulario.addEventListener('submit', validarFormulario );
    
        monedaSelect.addEventListener('change', leerValor);
        criptoSelect.addEventListener('change', leerValor);
    
    });
    
    const obtenerCriptomoneda = criptomonedas => new Promise( resolve => {
        resolve(criptomonedas);
    });
    
    function consultarMonedasTop() {
    
        const criptomonedasTop = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
        
        fetch( criptomonedasTop )
            .then( respuesta => respuesta.json() )
            .then( resultado => obtenerCriptomoneda( resultado.Data ))
            .then( criptomonedas => optionCriptomoneda( criptomonedas ))
                 
    }
    
    function optionCriptomoneda( criptomonedas ) {
    
        criptomonedas.forEach( ( criptomoneda, idx ) => {
    
            const { CoinInfo: { Name, FullName } } = criptomoneda;
    
            const option = document.createElement('option');
            option.value = Name;
            option.innerHTML = `${idx+1}. ${ FullName }`;
    
            criptomonedasOption.appendChild( option )
            
        });
    
    }
    
    function leerValor( e ) {
    
        objBusqueda[e.target.name] = e.target.value;
    
    }
    
    function validarFormulario( e ) {
    
        e.preventDefault();
    
        const { moneda, criptomoneda } = objBusqueda;
    
        if ( moneda === '' || criptomoneda === '') {
            
            mostrarAlerta('Todos los campos son obligatorios');
            limpiarHTML();
            return;
    
        }
    
        consultarAPI();
    
    }
    
    function mostrarAlerta( mensaje ) {
    
        const error = document.querySelector('.error');
    
        if ( !error ) {
    
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('error');
        
            //mensaje
            divMensaje.innerHTML = mensaje;
        
            formulario.appendChild( divMensaje );
        
            setTimeout(() => {
        
                divMensaje.remove();
                
            }, 3000);
    
        }
    
    }
    
    function consultarAPI() {
    
        const { moneda, criptomoneda } = objBusqueda;
    
        mostrarSpinner();
    
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
        fetch( url )
            .then( respuesta => respuesta.json())
            .then( cotizacion => mostrarCotizacion( cotizacion.DISPLAY[criptomoneda][moneda] ))
    
    }
    
    function mostrarCotizacion( cotizacion ) {
    
        limpiarHTML();
    
        const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    
        const precio = document.createElement('p');
        precio.classList.add('precio');
        precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;
    
        const precioAlto = document.createElement('p');
        precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;
    
        const precioBajo = document.createElement('p');
        precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;
    
        const ultimasHoras = document.createElement('p');
        ultimasHoras.innerHTML = `Variación ultimas 24 horas: <span>${CHANGEPCT24HOUR} %</span>`;
    
        const ultimaActualizacion = document.createElement('p');
        ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;
    
        resultado.appendChild(precio);
        resultado.appendChild(precioAlto);
        resultado.appendChild(precioBajo);
        resultado.appendChild(ultimasHoras);
        resultado.appendChild(ultimaActualizacion);
    
    }
    
    function limpiarHTML() {
    
        while ( resultado.firstChild ) {
    
            resultado.removeChild( resultado.firstChild )
            
        }
    
    }
    
    function mostrarSpinner() {
    
        limpiarHTML();
    
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
    
        spinner.innerHTML = `
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        `;
    
        resultado.appendChild(spinner);
    
    }
    
})();