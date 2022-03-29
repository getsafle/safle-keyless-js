const APIS = {
    login: process.env.AUTH_URL + '/auth/local',
    retrieve_vault: process.env.AUTH_URL + '/vault/retrieve',
    retrieve_encription_key: process.env.AUTH_URL + '/auth/encrypted-encryption-key',

}

export default APIS;