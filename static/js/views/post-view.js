var app = app || {};

var csrftoken = $.cookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

app.PostView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#post-template').html()),

    events: {
        'dblclick h3': 'edit',
        'dblclick .content': 'editcontent',
        'click .destroy': 'clear',
        'keypress .edit': 'updateOnEnter',
        'keydown .edit': 'revertOnEscape',
        'blur .edit': 'close',
        'keypress .editcontent': 'updateOnEnter',
        'keydown .editcontent': 'revertOnEscape',
        'blur .editcontent': 'closecontent'
    },

    initialize: function() {
        console.log("Post View Initialized...");
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        
    },

    render: function() {

        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$('input');
        return this;
    },

    edit: function () {
        console.log("edit called");
        this.$el.addClass('editing');
        this.$('h3').hide();
        this.$input.focus();
    },

    editcontent: function () {
        console.log("edit content called");
        this.$el.addClass('editingc');
        this.$('.content').hide();
        this.$('textarea').val(this.model.get('body'));
        this.$('textarea').focus();
    },
    
    close: function () {
        var value = this.$input.val();
        var trimmedval = value.trim();

        if(!this.$el.hasClass('editing')){
            return;
        }

        if(trimmedval){

            this.model.save({title: trimmedval}, {
                success: function () {
                    console.log("Changes Saved.");
                },
                error: function () {
                    console.log("error saving.");
                }
            });
        } else {
            this.clear();
        }

        this.$el.removeClass('editing');
        this.$('h3').show();

    },

    closecontent: function () {
        var value = this.$('textarea').val();
        var trimmedval = value.trim();

        if(!this.$el.hasClass('editingc')){
            return;
        }

        if(trimmedval){

            this.model.save({body: trimmedval}, {
                success: function () {
                    console.log("Changes Saved.");
                },
                error: function () {
                    console.log("error saving.");
                }
            });
        } else {
            this.clear();
        }

        this.$el.removeClass('editingc');
        this.$('.content').show();
    },

    updateOnEnter: function(e) {
        if(e.which === 13){
            if(this.$el.hasClass('editcontent')) {
                this.closecontent();
            } else {
                this.close();
            }
        }
    },

    revertOnEscape: function(e) {
        if(e.which === 27) {
            this.$el.removeClass('editing');
            this.$el.removeClass('editingc');
            this.$('h3').show();
            this.$('.content').show();
            this.$input.val(this.model.get('title'));
            this.$('textarea').val(this.model.get('body'));
        }
    },

    clear: function() {
        this.model.destroy();
    }
});

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});