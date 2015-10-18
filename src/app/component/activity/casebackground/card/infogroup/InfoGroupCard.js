define(function (require) {

    'use strict';

    var Card = require('component/activity/casebackground/card/Card');
    var template = require('text!component/activity/casebackground/card/infogroup/InfoGroupCard.hbs');
    var Info = require('component/activity/casebackground/card/info/Info');

    return Card.extend({

        template: template,

        initialize: function () {
            Card.prototype.initialize.apply(this, arguments);
            this.setDroppable({types: Info});
        }

    });

});

