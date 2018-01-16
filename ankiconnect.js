class Ankiconnect{
    constructor() {
        this.options    = {};
        this.info       = {};
    }
    
    addNote(options, info) {
        let note = {
            fields: {},
            tags: ['chrome']
        };
        let {word, sent, defs} = info;
    
        note.deckName  = options.deck;
        note.modelName = options.type;
        note.fields[options.word] = word;
        note.fields[options.sent] = sent;
        note.fields[options.defs] = defs;
    
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
