class Ankibookmarklet {

    constructor() {

        this.point = {
        x: 0,
        y: 0,
        };
        this.noteinfo = {};
        this.options = loadOptions();
        this.popup = new Popup();
        this.translator = new Translator();
        this.target = isiOS() ? new Ankimobile() : new Ankiconnect();
        this.timeout = null;

        window.addEventListener('mousemove', e => this.onMouseMove(e));
        window.addEventListener('mousedown', e => this.onMouseDown(e));
        window.addEventListener('touchstart', e => this.onTouchStart(e));
        window.addEventListener('message', e => this.onFrameMessage(e));
        document.addEventListener('selectionchange', e => this.userSelectionChanged(e));
        window.addEventListener('selectionend', e => this.onSelectionEnd(e));


        showIndicator(this.options);
    }

    onMouseMove(e) {
        this.point = {
        x: e.clientX,
        y: e.clientY,
        };
    }

    userSelectionChanged(e) {

        // wait 500 ms after the last selection change event
        if (this.timeout) {
        clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
                var selEndEvent = new CustomEvent("selectionend");
                window.dispatchEvent(selEndEvent);
            }, 500);
    }

    onSelectionEnd(e) {

        // reset selection timeout
        this.timeout = null;

        const selection = window.getSelection();
        const word = (selection.toString() || '').trim();
        this.translator.getTranslation(word).then((defs) => {
        let sent = getSentence(word);
        this.noteinfo = {
            word,
            defs,
            sent,
        };
        const content = renderPopup(this.noteinfo, this.options);
        this.popup.showNextTo({
            x: this.point.x,
            y: this.point.y,
        }, content);
        }).catch(err => console.log(err));

    }

    onMouseDown(e) {
        this.popup.hide();
    }

    onTouchStart(e) {
        this.popup.hide();
        const touch = e.touches[0];
        this.point = {
        x: touch.clientX,
        y: touch.clientY,
        };
    }

    onFrameMessage(e) {
        this.target.addNote(this.options, this.noteinfo);
    }
}
