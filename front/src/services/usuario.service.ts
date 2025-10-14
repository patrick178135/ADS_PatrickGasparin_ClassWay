import axios from "axios"

const urlBase = "http://localhost:3002"

class UsuarioService {

    async getUsuarios() {
        return axios.get(`${urlBase}/usuario`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }
    

}

export default new UsuarioService