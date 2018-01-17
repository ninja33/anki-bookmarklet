class Ankimobile {
    constructor() {
        this.options = {};
        this.noteinfo = {};
    }

    addNote(options, noteinfo) {
        this.options = options;
        this.noteinfo = noteinfo;
        let ankiNote = `anki://x-callback-url/addnote?\
            profile=User%201&\
            deck=${options.deck}&\
            type=${options.type}&\
            fld${options.word}=${noteinfo.word}&\
            fld${options.defs}=${noteinfo.defs}&\
            fld${options.sent}=${noteinfo.sent}&\
            tags=ankimobile\
            dupes=1`;

        window.open(ankiNote, '_blank');
    }
}
