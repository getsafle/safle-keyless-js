const config = {
    networks: 'https://raw.githubusercontent.com/getsafle/multichain-data/main/chains.json',
    assets: 'https://raw.githubusercontent.com/getsafle/multichain-data/main/assets.json',
    gasFeeApiEth: 'https://gas-api.metaswap.codefi.network/networks/#{chainid}/suggestedGasFees',
    gasFeeApiPolygon: `https://gasstation-mainnet.matic.network/`,
    backupGasFeeApiEth: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle',
    backupGasFeeApiPolygon: 'https://api.polygonscan.com/api?module=gastracker&action=gasoracle',

    SAFLE_TOKEN_API: 'https://data.getsafle.com',
    AUTH_URL: 'https://auth.getsafle.com',
    RECAPTCHA_SITE_KEY: '6Lf8HVIaAAAAADBeZl94tnebAST20hEZOHWzQMBD',
    KEYLESS_UI_CLASSNAME: 'safle_98352395325_ui',
    WALLET_WORD_SPLIT: '81242854362396934869396898496a39259235989f',

    OPEN_WALLET_LINK: 'https://app.getsafle.com/dashboard',
    SIGNUP_URL: 'https://app.getsafle.com/sign-up',
    FORGOTPASS_URL: 'https://app.getsafle.com/forgot-pass'
}
module.exports = config;