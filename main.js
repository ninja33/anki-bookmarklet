class Ankibookmarklet {
    constructor() {

        this.noteinfo = {};
        this.options = loadOptions();
        this.popup = new Popup();
        this.translator = new Translator();
        this.target = new Ankiconnect();

        window.addEventListener('mousedown', (e)=>this.onMouseDown(e));
        window.addEventListener('mouseup', (e)=>this.onMouseUp(e));
        window.addEventListener('message', (e)=>this.onFrameMessage(e));

        //window.addEventListener('touchstart', onMouseDown);
        //window.addEventListener('touchend', onMouseUp);

        showIndicator(this.options);
    }

    onMouseDown(e) {
        this.popup.hide();
    }

    onMouseUp(e) {
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
                x: e.clientX,
                y: e.clientY
            }, content);
        });
    }

    onFrameMessage(e) {
        this.target.addNote(this.options, this.noteinfo);
    }
}

window.ankibookmarklet = new Ankibookmarklet();