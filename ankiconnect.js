class Ankiconnect {
    constructor() {
        this.options    = {};
        this.noteinfo       = {};
    }
    
    addNote(options, noteinfo) {
        let note = {
            fields: {},
            tags: ['chrome']
        };
    
        note.deckName  = options.deck;
        note.modelName = options.type;
        note.fields[options.word] = noteinfo.word;
        note.fields[options.defs] = noteinfo.defs;
        note.fields[options.sent] = noteinfo.sent;
    
        var ankiNote = {
            action: 'addNote',
            params: {
                note
            }
        };
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify(ankiNote));
    }
}
