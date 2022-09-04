import config from './../config/config';

const APIS = {
    login: config.AUTH_URL + '/auth/local',
    retrieve_vault: config.AUTH_URL + '/vault/retrieve',
    retrieve_encription_key: config.AUTH_URL + '/auth/encrypted-encryption-key',

}

export default APIS;