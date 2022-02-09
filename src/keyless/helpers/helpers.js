export const inlineS = ( styles ) => {
    const keys = Object.keys( styles );
    return Object.values( styles ).map( (el, idx) => ''+keys[idx]+':'+el ).join(';');
}