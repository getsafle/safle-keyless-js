export const inlineS = ( styles ) => {
    const keys = Object.keys( styles );
    return Object.values( styles ).map( (el, idx) => ''+keys[idx]+':'+el ).join(';');
}

export const middleEllipsis = ( text, split=3 ) => {
    if( !text ){
        return;
    }
    const sz = Math.floor( text.length / split );
    // console.log( text );
    // console.log( text.slice( 0, sz ) + '...' + text.slice( -sz ) );
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