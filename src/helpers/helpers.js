export const kl_log = ( msg ) => {
    // console.log( 'logging', process.env.ENABLE_LOGGING );
    if( process.env.ENABLE_LOGGING === true ){
        console.log( msg );
    }
}
export const inlineS = ( styles ) => {
    const keys = Object.keys( styles );
    return Object.values( styles ).map( (el, idx) => ''+keys[idx]+':'+el ).join(';');
}

export const middleEllipsis = ( text, split=3 ) => {
    if( !text ){
        return;
    }
    const sz = Math.floor( text.length / split );
    // kl_log( text );
    // kl_log( text.slice( 0, sz ) + '...' + text.slice( -sz ) );
    return text.slice( 0, sz ) + '...' + text.slice( -sz );
}
export const middleEllipsisMax = ( text, maxLen ) => {
    if( !text ){
        return;
    }
    return text.slice( 0, maxLen ) + '...' + text.slice( -maxLen );
}


export const maxChars = ( text, max ) => {
    return text.length > max? text.substr( 0, max )+'' : text;
}

export const copyToClipboard = ( str ) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
}

export const formatPrice = ( price, nums ) => {
    if( parseInt( price ) == 0 ){
        nums += 8;
    }
    let str = price.toString();
    str = str.slice(0, (str.indexOf(".")) + nums + 1); 
    return Number(str);
}
export const formatXDecimals = ( price, nums ) => {
    let str = price.toString();
    str = str.slice(0, (str.indexOf(".")) + nums + 1); 
    return Number(str);
}