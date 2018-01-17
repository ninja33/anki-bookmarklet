class Ankibookmarklet {
    constructor() {

        this.noteinfo = {};
        this.options = loadOptions();
        this.popup = new Popup();
        this.translator = new Translator();
        this.target = new Ankiconnect();
        this.selectionEndTimeout = null;

        window.addEventListener('mousedown', (e)=>this.onMouseDown(e));
        window.addEventListener('mouseup', (e)=>this.onMouseUp(e));
        window.addEventListener('message', (e)=>this.onFrameMessage(e));
        window.addEventListener('selectionEnd', (e)=>this.onSelectionEnd(e));

        //window.addEventListener('touchstart', onMouseDown);
        //window.addEventListener('touchend', onMouseUp);

        showIndicator(this.options);
    }
    
    document.onselectionchange = userSelectionChanged;

    userSelectionChanged() {
    
        // wait 500 ms after the last selection change event
        if (this.selectionEndTimeout) {
            clearTimeout(this.selectionEndTimeout);
        }
    
        this.selectionEndTimeout = setTimeout(function () {
            var selEndEvent = new CustomEvent("selectionEnd", {"detail": latestSelection});
            window.dispatchEvent(selEndEvent);
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
                x: e.clientX,
                y: e.clientY
            }, content);
        });

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