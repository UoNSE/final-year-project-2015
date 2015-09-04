define(function (require) {
    'use strict';

    var Component = require('core/Component');
    var template = require('text!component/activity/issues/Issues.hbs');

    var IssuesCollection = require('collection/Issues');
    var EvidenceCollection = require('collection/Evidence');
    var Panel = require('model/Panel');

    var Menu = require('component/activity/issues/menu/Menu');
    var Issue = require('component/activity/issues/card/issue/Issue');
    var Evidence = require('component/activity/issues/card/evidence/Evidence');

    return Component.extend({

        template: template,
        classes: ['issues'],
        styles: 'component/activity/issues/issues.css',

        menu: null,

        collection: {
            issues: new IssuesCollection(),
            evidence: new EvidenceCollection()
        },

        initialize: function () {

            Component.prototype.initialize.apply(this, arguments);

            var issues = this.collection.issues;
            var evidence = this.collection.evidence;

            // Listen to the sync events on both collections, which waits for the models to be loaded.
            this.listenTo(issues, 'sync', this.onIssuesSync);
            this.listenTo(evidence, 'sync', this.onEvidenceSync);

            issues.fetch();
            evidence.fetch();

            this.menu = this.add(new Menu());
            //this.menu.hide();

        },

        /**
         * An event triggered when the issues collection has synced upon a fetch call.
         *
         * @param issues The issues collection.
         */
        onIssuesSync: function (issues) {
            var n = issues.size();
            var distance = 10;
            issues.forEach(function (model, i) {
                var card = this.addIssue(model);
                var scale = i - ((n - 1) / 2);
                card.position.set(-300, scale * (distance + card.model.get('height')));
            }, this);
        },

        /**
         * An event triggered when the evidence collection has synced upon a fetch call.
         *
         * @param evidence The evidecne collection.
         */
        onEvidenceSync: function (evidence) {
            var n = evidence.size();
            var distance = 10;
            evidence.forEach(function (model, i) {
                var card = this.addEvidence(model);
                var scale = i - ((n - 1) / 2);
                card.position.set(300, scale * (distance + card.model.get('height')));
            }, this);
        },

        /**
         * Iterates through the issue collection and adds the cards to the view.
         *
         * @param model The issue model.
         * @returns {*}
         */
        addIssue: function (model) {
			var issue = this.add(new Issue({
                model: new Panel({
                    title: 'Issue',
                    body: model.get('content'),
                    color: 'danger'
                })
            }));
            this.bindDraggableEvents(issue);
            return issue;
        },

        /**
         * Iterates through the evidence collection and adds the cards to the view.
         *
         * @param model The evidence model.
         * @returns {*}
         */
        addEvidence: function (model) {
			var evidence = this.add(new Evidence({
                model: new Panel({
                    title: 'Evidence',
                    body: model.get('content'),
                    color: 'info'
                })
            }));
            this.bindDraggableEvents(evidence);
            return evidence;
        },

        /**
         * Binds the draggable events to the component.
         *
         * @param component The .
         */
        bindDraggableEvents: function (component) {
            component.on({
                drag: this.onDrag.bind(this),
                dragendsource: this.onDrop.bind(this)
            });
        },

        /**
         * An event triggered when a card is being dragged.
         */
        onDrag: function () {
            //this.menu.show();
        },

        /**
         * An event triggered when a card is being dropped.
         *
         * @param event
         */
        onDrop: function (event) {
            var menu = this.menu;
            var card = event.draggable;
            // Check if we are currently hovering on the delete button.
            if (menu.delete.isActive()) {
                card.remove();

            }
            // Check if we are currently hovering on the split button.
            if (menu.split.isActive()) {
                // TODO
            }
            //menu.hide();
        },

        createCard: function (cardType, content) {
			var panelType =  ( cardType === "Issue" ) ? "info" : "danger";
			return "<div class='panel panel-" + panelType + " abs-center "+cardType.toLowerCase()+" card' style='width: 300px; height: 100px'>"+"\n"+"<div class='panel-heading'>"+"\n"+"<h3 class='panel-title'>" + cardType + "</h3>"+"\n"+"</div>"+"\n"+"<div class='panel-body'>" +"\n"+ content +"\n"+ "</div>"+"\n"+"</div>";
		}

    });


});