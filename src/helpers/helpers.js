export const inlineS = ( styles ) => {
    const keys = Object.keys( styles );
    return Object.values( styles ).map( (el, idx) => ''+keys[idx]+':'+el ).join(';');
}

export const middleEllipsis = ( text, split=3 ) => {
    if( !text ){
        return;
    }
    const sz = Math.floor( text.length / split );
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

export const formatMoney = (number, decPlaces=2, decSep='.', thouSep=',') => {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}