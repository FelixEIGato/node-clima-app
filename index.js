require('dotenv').config();

const { leerInput, pause2, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// console.log(process.env.MAPBOX_KEY);


// console.log('hola');

const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt =  await inquirerMenu();

        switch ( opt ) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                //Buscar el lugar
                const lugares = await busquedas.ciudad( termino );
                // console.log(lugares);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0' ) continue;
                // console.log({id});

                const lugarSel = lugares.find( l => l.id === id );
                // console.log(lugarSel);
                
                //Guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre );
                //Clima

                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

                // console.log(clima)

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Min:', clima.min);
                console.log('Max:', clima.max);
                console.log('Como está el clima:', clima.desc.green);
                break;

                case 2:
                    busquedas.historialCapitalizado.forEach( (lugar, i) => {
                        const idx = `${ i + 1 }.`.green;
                        console.log( `${ idx } ${ lugar }` );
                    } )

        }

        await pause2();

    }while( opt !== 0 )

    
}

main();