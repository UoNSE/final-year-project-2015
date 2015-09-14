define(function (require) {

    'use strict';

    var Panel = require('component/panel/Panel');
    var template = require('text!component/activity/caseinformation/card/CaseInfoCard.hbs');

    return Panel.extend({
        template:template,
        styles: 'component/activity/caseinformation/card/CaseInfoCard.css',

        initialize: function () {
            Panel.prototype.initialize.apply(this, arguments);
            this.interactive = true;
            this.setDraggable({});
        },

		/*TODO refactor this event and function into SelectableText */
        events : {
            'click .list-item' : 'selectListItem'
        },

        selectListItem: function (event) {
            var item = $(event.target);

            if (!(item.hasClass('inv-list-item'))) {
                if (item.hasClass('selected-text')) {
                    $("#list-" + item.attr('id')).remove();
                } else {
                    item.clone().attr('id', 'list-' + item.attr('id')).addClass('inv-list-item well').css('box-shadow', '-3px 1px 6px 0 rgba(0,0,0,0.12)').appendTo($('.cpn-inventory').find('.panel-body'));
                }
            } else {
                var id = item.attr('id');
                item.remove();
                item = $("#" + (id.slice(5, id.length)));
            }
            item.toggleClass('selected-text');
        }

    });

});

