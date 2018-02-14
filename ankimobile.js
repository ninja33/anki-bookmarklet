class Ankimobile {
    constructor() {
        this.options = {};
        this.noteinfo = {};
    }

    addNote(note, options) {
        for(let key in options) {
            options[key] = encodeURI(options[key]);
        }

        for(let key in note) {
            note[key] = encodeURI(note[key]);
        }
        let ankiNote = `anki://x-callback-url/addnote?profile=${encodeURI('User 1')}&deck=${options.deck}&type=${options.type}&fld${options.word}=${note.expression}&fld${options.defs}=${note.definition}&fld${options.sent}=${note.sentence}&tags=ankimobiledupes=1`;

        window.open(ankiNote, '_blank');
    }
}
