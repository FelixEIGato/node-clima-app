const fs = require('fs');

const axios = require('axios');

class Busquedas { 

    historial = [];
    dbPath= './db/database.json';

    constructor() {
        //TODO : leer DB
        this.leerDB();
    }

    get historialCapitalizado() {

        return this.historial.map( lugar=>{ 

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        })

        
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
        }
    }

    get paramsWeather() {
        return { 
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async ciudad( lugar = '' ) {

        //petición http
        // console.log('ciudad', lugar);

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Lima%2C%20Provincia%20de%20Lima%2C%20Per%C3%BA.json?access_token=pk.eyJ1IjoiZmVsaXhlbGdhdG8xMjMiLCJhIjoiY2tudG1pa213MDNnZDJ3cms2Nnpld3hxeCJ9.0KvV0sR26mL1siWdDqYj2g&limit=5&language=es');
            // console.log(resp.data.features);

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

            // return []; //retornar las ciudades
            
        } catch (error) {
            return [];
        }

    }

    async climaLugar( lat, lon ) {
        try {
            
            // console.log(this.paramsWeather);

            // instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon},
            });
            // resp.data 

            const resp = await instance.get();

            // const instance2 = axios.get(`https://api.openweathermap.org/data/2.5/weather`,{
            //     params: {
            //         lat,
            //         lon,
            //         ...this.paramsWeather,
            //     }
            // });

            // const resp = await instance2;

            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }

        } catch (error) {
            console.log(error)
        }
    } 

    agregarHistorial( lugar = '' ) {

        //TODO: prevenir duplicados

        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //Grabar en DB

        this.guardarDB();
    }

    guardarDB(){
        
        const payload = {
            historial: this.historial,
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) )

    }

    leerDB(){

        if( !fs.existsSync(this.dbPath) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });

        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}

module.exports = Busquedas;