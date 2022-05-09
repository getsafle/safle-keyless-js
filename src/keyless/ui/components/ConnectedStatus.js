class ConnectedStatus {
    el;
    connectionStatus;
    activeChainUrl;

    statusClass = 'disconnected';
    statusLabel = 'Not Connected';
    statusDomain = 'Not Connected to any dApp';


    constructor( parentEl, status = false, activeChainUrl = '' ) {
        this.parentEl = parentEl;
        this.connectionStatus = status;
        this.activeChainUrl = activeChainUrl;

        this.beforeInit();
        this.parentEl.innerHTML = this.render();
    }

    beforeInit() {
        if (this.connectionStatus) {
            this.statusClass = 'connected';
            this.statusLabel = 'Connected';
            this.statusDomain =  this.activeChainUrl;
        }        
    }

    render(){
        return (`
            <div class="${this.statusClass}">${this.statusLabel}</div>
            <div class="hover-info--1">
                <div class="hover-info--1__triangle"></div>
                ${this.statusDomain}
            </div>
        `)
    }
}

export default ConnectedStatus; 