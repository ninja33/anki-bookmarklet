class Popup {
    constructor() {
        this.popup = null;
        this.offset = 10;
    }

    showAt(pos, content) {
        this.inject();

        this.popup.style.left = pos.x + 'px';
        this.popup.style.top = pos.y + 'px';
        this.popup.style.visibility = 'visible';

        this.setContent(content);
    }

    showNextTo(point, content) {

        this.inject();
        const elementRect = this.getRangeRect(point);
        const popupRect = this.popup.getBoundingClientRect();

        let posX = isiOS() ? point.x : elementRect.left;
        if (posX + popupRect.width >= window.innerWidth) {
            posX = window.innerWidth - popupRect.width;
        }

        let posY = isiOS() ? point.y : elementRect.bottom;
        posY = posY + this.offset;
        if (posY + popupRect.height >= window.innerHeight) {
            posY = elementRect.top - popupRect.height - this.offset;
        }

        var device = isiOS() ? "tp" : "mp";
        content = content + `
            <div class="abkl-sect" style="font-size:0.8em;">\
                ${device}-point-x: ${point.x} | ${device}-point-y:${point.y}<br>\
                element-left: ${elementRect.left} | element-width: ${elementRect.width}<br>\
                popup-left: ${popupRect.left} | popup-width: ${popupRect.width}<br>\
                window-width: ${window.innerWidth} | window-height: ${window.innerHeight}<br>\
                pos-x: ${posX} | pos-y: ${posY}<br>\
            </div>`;
        this.showAt({ x: posX, y: posY }, content);
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
        doc.srcdoc = content;
    }

    getRangeRect(point) {
        return document.caretRangeFromPoint(point.x, point.y).getBoundingClientRect();
    }

    sendMessage(action, params, callback) {
        if (this.popup !== null) {
            this.popup.contentWindow.postMessage({ action, params }, '*');
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
