import config from './../config/config';

const APIS = {
    login: config.AUTH_URL + '/auth/local',
    login_keyless: config.AUTH_URL + '/auth/keyless-login',
    retrieve_vault: config.AUTH_URL + '/vault/retrieve',
    retrieve_encription_key: config.AUTH_URL + '/auth/encrypted-encryption-key',
}

export default APIS;