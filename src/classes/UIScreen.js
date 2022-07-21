import { kl_log } from './../helpers/helpers';

class UIScreen {
    constructor(){

    }
    onInit(){
        
    }
    onShow(){

    }
    onBeforeHide(){
        
    }

    setView( el ){
        this.el = el;
    }

    setKeylessInstance( instance ){
        this.keyless = instance;
    }
    
    // @query => query syntax of the html element
    // @htmlContent => string / html content
    setHTML (query, htmlContent) {
        const el = this.el.querySelector(query);
        // kl_log('QUERY', el );
        if (el && htmlContent) {
            el.innerHTML = htmlContent;
        }
    }

}

export default UIScreen;