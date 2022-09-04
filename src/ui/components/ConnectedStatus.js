class ConnectedStatus {
    el;
    connectionStatus;
    activeDappUrl;

    statusClass = 'disconnected';
    statusLabel = 'Not Connected';
    statusDomain = 'Not Connected to any dApp';


    constructor( parentEl, status = false) {
        this.parentEl = parentEl;
        this.connectionStatus = status;
        this.activeDappUrl = window.location.hostname;

        this.beforeInit();
        this.parentEl.innerHTML = this.render();
    }

    beforeInit() {
        if (this.connectionStatus) {
            this.statusClass = 'connected';
            this.statusLabel = 'Connected';
        }      
    }

    render(){
        return (`
            <div class="${this.statusClass}">${this.statusLabel}</div>
            <div class="hover-info--1">
                <div class="hover-info--1__triangle"></div>
                ${this.activeDappUrl}
            </div>
        `)
    }
}

export default ConnectedStatus; 