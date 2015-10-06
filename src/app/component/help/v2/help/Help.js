define(function (require) {

    'use strict';

    var _ = require('underscore');
    var $ = require('jquery');
    var Component = require('core/Component');
    var template = require('text!component/help/v2/help/Help.hbs');
    var ActionButton = require('component/actionbutton/ActionButton');

    /**
     * @class Help
     *
     * @classdesc A component that provides a detached panel and associated buttons,
     * which float to the top LHS of the screen. Help can be used to provide the user
     * a list of instructions to follow.
     *
     * @example
     * let Help = require('component/help/v2/help/Help');
     * // include html, such as an unordered list, in an external handlebars file
     * let HelpText = require('text!component/activity/goals/help/helpContent.hbs');
     *
     * return Component.extend({
     *
     *  // in your initialize function
     *  initialize: function () {
     *      Component.prototype.initialize.apply(this, arguments);
     *
     *      // add help component to the page
     *       this.help = this.add(new Help({
     *           model: new HelpModel({
     *               title: 'Help',
     *               width: 300,
     *               helpContent: HelpText
     *           })
     *       }));
     *  },
     *
     */
    var Panel = Component.extend({
        // important for having fixed position near back button
        template: template,
        styles: 'component/help/v2/help/Help.css',
        detached: true,
        origin: 'top left',
        events: {
            'click .cpn-button': 'close'
        },

        initialize: function () {
            Component.prototype.initialize.apply(this, arguments);
            this.position.x = 80;
        },

        close: function () {
            this.hide();
        }

    });

    /**
     * @class HelpButton
     * @classdesc This is a custom ActionButton for handling
     * hiding and showing the Help Information.
     */
    return ActionButton.extend({
        detached: true,
        origin: 'top left',

        initialize: function (model) {
            this.model = {
                color: 'primary',
				icon: 'action-help',
				classes: 'help-btn'
            };
            ActionButton.prototype.initialize.apply(this, arguments);
            this.position.y = -80;
            this.panel = this.add(new Panel({model: model}));
        },

        onClick: function (event) {
            let panel = this.panel;
            panel.toggle();
            if (panel.visible) {
                panel.bringToFront();
            }
        }

    });

});


