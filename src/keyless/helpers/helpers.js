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
export const maxChars = ( text, max ) => {
    return text.length > max? text.substr( 0, max )+'' : text;
}