class Popup {
    constructor() {
        this.popup  = null;
        this.offset = 10;
    }

    showAt(pos, content) {
        this.inject();

        this.popup.style.left       = pos.x + 'px';
        this.popup.style.top        = pos.y + 'px';
        this.popup.style.visibility = 'visible';

        this.setContent(content);
    }

    showNextTo(elementRect, content) {
        this.inject();

        const popupRect = this.popup.getBoundingClientRect();

        let posX = elementRect.left;
        if (posX + popupRect.width >= window.innerWidth) {
            posX = window.innerWidth - popupRect.width;
        }

        let posY = elementRect.bottom + this.offset;
        if (posY + popupRect.height >= window.innerHeight) {
            posY = elementRect.top - popupRect.height - this.offset;
        }

        this.showAt({x: posX, y: posY}, content);
    }

    hide() {
        if (this.popup !== null) {
            this.popup.style.visibility = 'hidden';
        }
    }

    setContent(content) {
        if (this.popup === null) {
            return;
        }

        this.popup.contentWindow.scrollTo(0, 0);
        
        const doc = this.popup;
        doc.srcdoc=content;
    }

    sendMessage(action, params, callback) {
        if (this.popup !== null) {
            this.popup.contentWindow.postMessage({action, params}, '*');
        }
    }

    inject() {
        if (this.popup !== null) {
            return;
        }

        this.popup = document.createElement('iframe');
        this.popup.id = 'abkl-popup';
        this.popup.addEventListener('mousedown', (e) => e.stopPropagation());
        this.popup.addEventListener('scroll', (e) => e.stopPropagation());

        document.body.appendChild(this.popup);
    }
}