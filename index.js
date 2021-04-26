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
                // console.log({id});
                const lugarSel = lugares.find( l => l.id === id );
                // console.log(lugarSel);
                //Clima

                //Mostrar resultados

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:',);
                console.log('Min::',);
                console.log('Max::',);
                break;
        }

        await pause2();

    }while( opt !== 0 )

    
}

main();