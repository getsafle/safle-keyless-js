
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
    
    setHTML (query, htmlContent) {
        const el = this.el.querySelector(query);
        if (el && htmlContent) {
            el.innerHTML = htmlContent;
        }
    }

}

export default UIScreen;