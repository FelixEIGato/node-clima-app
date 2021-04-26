const axios = require('axios');

class Busquedas { 

    historial = ['Tegucigalpa', 'Madrid', 'San José'];

    constructor() {
        //TODO : leer DB
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
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

}

module.exports = Busquedas;