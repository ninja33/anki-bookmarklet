class Ankibookmarklet {
    constructor() {

        this.mousepoint = { x: 0, y: 0 };
        this.noteinfo = {};
        this.options = loadOptions();
        this.popup = new Popup();
        this.translator = new Translator();
        if (isiOS()) {
            this.target = new Ankimobile();
        } else {
            this.target = new Ankiconnect();
        }
        this.selectionEndTimeout = null;

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('touchmove', (e) => this.onTouchMove(e));
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('touchstart', (e) => this.onMouseDown(e));
        document.addEventListener('message', (e) => this.onFrameMessage(e));
        document.addEventListener("selectionchange", (e) => this.userSelectionChanged(e));
        document.addEventListener('selectionend', (e) => this.onSelectionEnd(e));


        showIndicator(this.options);
    }

    onMouseMove(e) {
        this.mousepoint = { x: e.clientX, y: e.clientY };
    }

    onTouchMove(e) {
        //e.preventDefault();
        let touch = e.touches[0];
        this.mousepoint = { x: touch.pageX, y: touch.pageY };
    }

    userSelectionChanged(e) {

        // wait 500 ms after the last selection change event
        if (this.selectionEndTimeout) {
            clearTimeout(this.selectionEndTimeout);
        }

        this.selectionEndTimeout = setTimeout(function () {
            var selEndEvent = new CustomEvent("selectionend");
            document.dispatchEvent(selEndEvent);
        }, 500);
    }

    onSelectionEnd(e) {

        // reset selection timeout
        this.selectionEndTimeout = null;

        const selection = window.getSelection();
        const word = (selection.toString() || '').trim();
        this.translator.getDefinition(word).then(defs => {
            var sent = getSentence(word);
            this.noteinfo = {
                word,
                defs,
                sent
            };
            let content = renderPopup(this.noteinfo)
            this.popup.showNextTo({
                x: this.mousepoint.x,
                y: this.mousepoint.y
            }, content);
        });

    }

    onMouseDown(e) {
        this.popup.hide();
    }

    onFrameMessage(e) {
        this.target.addNote(this.options, this.noteinfo);
    }
}