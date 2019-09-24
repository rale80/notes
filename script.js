(function(){
	
	const model = {
		init() {
			if(!localStorage.notes) {
				localStorage.notes = JSON.stringify([]);
			}
		},
		add(obj) {
			const data = JSON.parse(localStorage.notes);
            data.push(obj);
            localStorage.notes = JSON.stringify(data);
		},
		getAllNotesReversed() {
			const notes = JSON.parse(localStorage.notes);
            return notes.reverse(function(curr, next) {
            	if(Number(curr.id) < Number(next.id)) return 1;
            	else return -1;
            });
        },
        getAllNotes() {
			return JSON.parse(localStorage.notes);
        },
        update(notes) {
        	localStorage.notes = JSON.stringify(notes);
        },
        delete(notes) {
        	localStorage.notes = JSON.stringify(notes);
        }
	};

	const controller = {
		init() {
            model.init();
            view.init();
        },
        addNewNote(title, content) {
            model.add({
            	id: Date.now(), 
                title: title,
                content: content
            });
            view.render();
        },
        getNotes() {
            return model.getAllNotesReversed();
        },
        getNoteById(id) {
        	const notes = model.getAllNotes();
        	const note = notes.find(function(note) {
        		return note.id === id;
        	});
        	return note;
        },
        updateNote(noteToUpdate) {
        	const notes = model.getAllNotes();
        	notes.map(function(note) {
        		if(note.id === noteToUpdate.id) {
        			note.content = noteToUpdate.content;
        		}
        	});
        	model.update(notes);
        },
        deleteNote(noteToDelete) {
        	const notes = model.getAllNotes();
        	notes.map(function(note, index) {
        		if(note.id === noteToDelete.id) {
        			notes.splice(index, 1);
        		}
        	});
        	model.update(notes);
        	view.render();
        }
	};

	const view = {
		init() {
            this.noteList = $('#noteList');
            this.noteContent = $('#noteContent');
            this.currentNote = null;

        	// add input click handler
            $('input#title').on('click', function(e) {
            	view.currentNote = null;
                view.noteContent.html('');
                view.noteList.find('li').each(function() { 
                    $(this).removeClass('selected');
                });
            });

            // add button click handler
            $('#btnAdd').on('click', function(e) {
                const title = $('#title');
                if(title.val().trim() !== '') {
                    controller.addNewNote(title.val(), view.noteContent.html());
                    title.val('');  
                    title.attr('placeholder', 'Note Title').removeClass('invalid');
                } else {
                    title.attr('placeholder', 'You must enter title').addClass('invalid');
                }
            });

            // remove button click handler
            $('#btnRemove').on('click', function(e) {
            	controller.deleteNote(view.currentNote);
            });

            // add note list click handler
            this.noteList.on('click', 'li', function(e) {
        		$(e.delegateTarget).find('li').each(function() { 
            		$(this).removeClass('selected');
            	});
            	$(this).addClass('selected');

            	const id = Number($(this).find('input').val());
            	const note = controller.getNoteById(id);
            	view.noteContent.html(note.content);
            	view.currentNote = note;
            });

            // add content change on blur
            this.noteContent.on('blur', function() {
                
            	if(view.currentNote === null) {
            		return false;
            	}
        		let content = view.noteContent.html();
        		if(view.currentNote.content !== content) {
        			view.currentNote.content = content;
        			controller.updateNote(view.currentNote);  
    			}    
        	});

            view.render();
        },
        render() {
        	// populate list of notes
            let noteListHtmlStr = ``;
            controller.getNotes().forEach(function(note){
                noteListHtmlStr += `<li class="note">
                						<h4>${note.title}</h4>
                						<small>${formatDate(note.id)}</small>
                						<input type="hidden" value="${note.id}">
            						</li>`;
            });
            this.noteList.html(noteListHtmlStr);
            this.noteContent.html('');
            this.noteList.find('li:first').trigger('click');
        }
	};

	function formatDate(dateStr) {
		const date = new Date(dateStr).toDateString();
        const time = `${formatTime(new Date(dateStr).getHours())}:${formatTime(new Date(dateStr).getMinutes())}`;
		return `${date}, ${time}`;
	}

    function formatTime(time) {
        if(time.toString().length === 1) {
            return `0${time}`;
        } else {
            return time;
        }
    }

	controller.init();

})();

