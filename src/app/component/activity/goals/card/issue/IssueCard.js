(define(function (require) {

    'use strict';

    let Card = require('component/activity/goals/card/Card');

    /**
     * @classdesc A Type of Card that can hold an Issue.
     * @name GoalCard
     * @class
     */
    return Card.extend({

        /**
         * Initialisation.
         *
         * @override
         */
        initialize: function () {
            // invoke super(arguments)
            Card.prototype.initialize.apply(this, arguments);
            this.className = 'Issue';
            // allow subtypes of Card to be dropped onto this
            // avoids having a dependency on issues module
            this.setDroppable({types: Card});
        }

    });

}));