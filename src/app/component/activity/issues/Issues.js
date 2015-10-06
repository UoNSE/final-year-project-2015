define(function (require) {
    'use strict';

    var Component = require('core/Component');
    var template = require('text!component/activity/issues/Issues.hbs');
    var TWEEN = require('tweenjs');
    var Vector2 = require('math/Vector2');

    var IssuesCollection = require('collection/Issues');
    var EvidenceCollection = require('collection/Evidence');
    var IssueGroupCollection = require('collection/IssueGroups')
    var IssueModel = require('model/Issue');
    var EvidenceModel = require('model/Evidence');
    var IssueGroupModel = require('model/IssueGroup');
    var ActionButtonModel = require('model/ActionButton');

    var Menu = require('component/activity/issues/menu/Menu');
    var Issue = require('component/activity/issues/card/issue/Issue');
    var Evidence = require('component/activity/issues/card/evidence/Evidence');
    var IssueGroup = require('component/activity/issues/card/issuegroup/IssueGroup');
    var ActionButton = require('component/actionbutton/ActionButton');
    var Score = require('component/activity/issues/score/Score');
    var Panel = require('component/panel/Panel');

    var Help = require('component/help/help');

    return Component.extend({
        //hack to stop duplicating cards
        mergedYet: false,
        template: template,
        classes: 'issues',
        styles: 'component/activity/issues/Issues.css',

        menu: null,
        gameCredit: 0,

        collection: {
            issues: new IssuesCollection(),
            evidence: new EvidenceCollection(),
            issueGroup: new IssueGroupCollection()
        },

        initialize: function (inventory, params) {

            Component.prototype.initialize.apply(this, arguments);
            this.gameCredit = 0;

            this.inventory = inventory;
            this.params = params;

			this.width = 300;
			this.height = 90;

            var issues = this.collection.issues;
            var evidence = this.collection.evidence;
            var issueGroups = this.collection.issueGroup;

            // Listen to the sync events on both collections, which waits for the models to be loaded.
            this.listenTo(issues, 'sync', this.onIssuesSync);
            this.listenTo(evidence, 'sync', this.onEvidenceSync);
            this.listenTo(issueGroups, 'sync', this.onIssueGroupSync);

            if (this.canLoad()) {
                this.loadCards(issues, evidence, issueGroups);
            }
            else{
                this.fetchCards(issues, evidence);
            }

            this.menu = this.add(new Menu());
            this.menu.on({
                delete: this.onDelete.bind(this),
                split: this.onSplit.bind(this)
            });
            this.menu.hide();

           this.add(new Help({
                model: {
                    helpContent: 'Join pieces of evidence together to score points.<br>'+
                        'Once you have enough points you can unlock issues in the '+
                        '<button class="mtl-fab btn btn-material-blue btn-fab btn-raised mdi-action-shopping-cart" style="width: 25px;height: 25px;padding: 0px;"> </button> menu<br>'+
                        'Once all issues are linked with the correct evidence you will be able to continue'
                }
            }));
            //add the topic unlock button
            this.add(new ActionButton({
                //detached:true,
                model: new ActionButtonModel({
                    icon: 'action-shopping-cart',
                    color: 'blue',
                    href: 'cases/' + params['case_id'] + '/activity/issues/unlock',
                    classes: 'topic-unlock'
                    //styles: {
                    //    width:100,
                    //    height:100,
                    //    'font-size':40
                    //}
                })
            })).detached = true;

            this.scoreContainer = this.add(new Score());

            this.scoreTrigger = -6;
            this.scoreHint = this.add(new Panel({
                model: {
                    body: 'You now have enough credit to purchase issues!',
                    width: 200
                }
            }));
            this.scoreHint.hide();
        },

        /**
         * Check if there are cards in the inventory
         * @returns true if the inventory has cards
         */
        canLoad: function(){
            //TODO check if inventory has cards
            return false;
        },

        /**
         * Load cards from inventory
         */
        loadCards: function(issues, evidence, issueGroups){
            //TODO load cards from inventory
            console.log("Load cards");
            this.collection.issues = this.inventory.get("issues");
            this.collection.evidence = this.inventory.get("evidence");
            this.collection.issueGroup = this.inventory.get("issuegroups");

            issues = this.collection.issues;
            evidence = this.collection.evidence;
            issueGroups = this.collection.issueGroup;
            issueGroups.trigger('sync');
            evidence.trigger('sync');
            issues.trigger('sync');

        },


        /**
         * sync issuegroups to inventory
         */
        syncCards: function(){
            //clear existing collection
            this.inventory.attributes.issuegroup.reset();
            //sync new collection
            this.inventory.attributes.issuegroup.add(this.collection.issueGroup);
        },

        /**
         * fetch card data from db
         */
        fetchCards: function(issues, evidence){
            console.log("Fetch cards");
            issues.fetch();
            evidence.fetch();
        },

        /**
         * An event triggered when the issues collection has synced upon a fetch call.
         *
         * @param issues The issues collection.
         */
        onIssuesSync: function (issues) {
            var n = issues.size();
            var distance = 10;
            issues.forEach((model, i) => {
                var card = this.addIssue(new IssueModel({
					width: this.width,
					height: this.height,
					title: 'Issue',
                    issueid: model.get('id'),
					body: model.get('data'),
                    cost: model.get('cost'),
					color: 'danger'
				}));
                var scale = i - ((n - 1) / 2);
                this.gameCredit -= card.model.get('cost');
                card.position.set(-300, scale * (distance + card.model.get('height')));
            });
            this.updateScore();
        },


        onIssueGroupSync: function (issues) {
            var n = issues.size();
            var distance = 10;
            issues.forEach((model, i) => {
                var card = this.add(new IssueGroup({
                    model: new IssueGroupModel({
                        width: this.width,
                        title: 'Issues and evidence',
                        color: 'success',
                        issue: issue,
                        evidence: evidence
                    })
                }));
            var scale = i - ((n - 1) / 2);
            this.gameCredit -= this.getScore(card);
            card.position.set(-300, scale * (distance + card.model.get('height')));
        });
        this.updateScore();
        },

        /**
         * An event triggered when the evidence collection has synced upon a fetch call.
         *
         * @param evidence The evidecne collection.
         */
        onEvidenceSync: function (evidence) {
            var n = evidence.size();
            var distance = 10;
            evidence.forEach((model, i) => {
                var card = this.addEvidence(new EvidenceModel({
					width: this.width,
					height: this.height,
					title: 'Evidence',
					body: model.get('data'),
                    score: model.get('score'),
                    maxscore: model.get('maxscore'),
                    issueid: model.get('issueId'),
					color: 'info'
				}));
                var scale = i - ((n - 1) / 2);
                var score = card.model.get('score');
                this.gameCredit += score;
                if(score < card.model.get('maxscore')) {
                    this.gameCredit -= 2;
                }
                card.position.set(300, scale * (distance + card.model.get('height')));
            });
            this.updateScore();
        },

        /**
         * Iterates through the issue collection and adds the cards to the view.
         *
         * @param model The issue model.
         * @returns {*}
         */
        addIssue: function (model) {
			var issue = this.add(new Issue({
                model: model
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
                model: model
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
                dragendsource: this.onDragEnd.bind(this),
                dropsink: this.onDrop.bind(this)
            });
        },

        /**
         * An event triggered when a card is being dragged.
         */
        onDrag: function () {
            this.menu.show();
            this.mergedYet = false;
        },

        onDragEnd: function(){
            this.menu.hide();
        },

        /**
         * An event triggered when a card is being dropped.
         *
         * @param event
         */
        onDrop: function (event) {
            if (this.mergedYet) {
                return;
            }
            this.mergedYet = true;
            var draggable = event.draggable;
            var droppable = event.droppable;
            this.merge(draggable, droppable);
            this.updateScore();
        },

        updateScore: function(){
            this.scoreContainer.setScore(this.gameCredit);

            if (this.gameCredit >= this.scoreTrigger) {
                this.triggerScoreHint();
            }
            //$(".score-display").text("CREDIT: " + gameCredit);
        },

        onDelete: function (event) {
            // Refund score.
            var card = event.draggable;
            var model = card.model;
            var type = this.resolveType(card);
            if (type.issue) {
                this.gameCredit+= model.get('cost');
                this.collection.issues.remove(this.collection.issues.where({data : model.attributes.body}));
            }
            else if (type.evidence) {
                var score = model.get('score');
                this.gameCredit -= score;
                if (score < model.get('maxscore')) {
                    this.gameCredit += 2;
                }
                this.collection.evidence.remove(this.collection.evidence.where({data : model.attributes.body}));
            }
            else {
                this.gameCredit -= this.getScore(card);
                this.removeIssueGroup(card);
            }

            card.remove();
            this.updateScore();
        },

        onSplit: function (event) {

            var issueGroup = event.draggable;
            var model = issueGroup.model;

            this.gameCredit -= this.getScore(issueGroup);

            var issue = model.get('issue');
            if (issue) {
                this.addIssue(issue);
                this.collection.issues.add(issue);
                this.gameCredit -= issue.get('cost');

            }

            var evidence = model.get('evidence');
            evidence.each(model => {
                var score = model.get('score');
                this.addEvidence(model);
                this.gameCredit += score;
                if (score < model.get('maxscore')) {
                    this.gameCredit -= 2;
                }
                this.collection.evidence.add(model);
            });
            this.removeIssueGroup(issueGroup);
            issueGroup.remove();
            this.updateScore();

        },

        removeIssueGroup: function(group){
            //find group in collection.issuegroup
            var mark;
            this.collection.issueGroup.each(function(model){
                if(model.attributes.model.get("evidence").where({body: group.model.get("evidence").models[0].attributes.body}).length >0){
                    mark = model;
                }
            })
            this.collection.issueGroup.remove(mark);

        },

        merge: function (draggable, droppable) {

            var draggableType = this.resolveType(draggable);
            var droppableType = this.resolveType(droppable);

            if (droppable instanceof IssueGroup && draggable instanceof IssueGroup) {

                //only 1 issue allowed
                if (draggable.model.get('issue') && droppable.model.get('issue')) {
                    draggable.shake();
                    return;
                }
                //load old collections

                var issue = droppable.model.get('issue') || draggable.model.get('issue');
                var evidence = draggable.model.get('evidence');

                if (issue) {
                    var issueID = issue.attributes.issueid;
                    var correctmerge = true;
                    var Ielist = droppable.model.get('evidence');
                    evidence.each(model => {
                        if (issueID != model.get('issueid')) {
                            correctmerge = false
                        }
                    });
                    Ielist.each(function (model) {
                        if (issueID != model.get('issueid')) {
                            correctmerge = false
                        }
                    });
                    if (correctmerge === false) {
                        draggable.shake();
                        return;
                    }
                }

                evidence.add(droppable.model.get('evidence').toJSON());

                this.gameCredit -= this.getScore(draggable);
                this.gameCredit -= this.getScore(droppable);
                this.removeIssueGroup(draggable);
                this.removeIssueGroup(droppable);
            }
            else if (droppable instanceof IssueGroup || draggable instanceof IssueGroup) {
                var group = droppable instanceof IssueGroup ? droppable : draggable;
                var card = droppable instanceof IssueGroup ? draggable : droppable;
                var cardType = droppable instanceof IssueGroup ? draggableType : droppableType;
                //only 1 issue allowed
                if(card instanceof Issue && group.model.get('issue') != undefined){
                    draggable.shake();
                    return;
                }

                //load old collections

                var issue = cardType.issue || group.model.get('issue');
                var collection = [];
                var ev = group.model.get('evidence');
                if (cardType.evidence) {collection.push(cardType.evidence);}
                var evidence = new Backbone.Collection(collection);
                evidence.add(ev.toJSON());


                if (issue) {
                    var issueID = issue.get('issueid');
                    var correctmerge = true;
                    evidence.each(function (model) {
                        if (issueID !== model.get('issueid')) {
                            correctmerge = false;
                        }
                    });
                    if (!correctmerge) {
                        draggable.shake();
                        return;
                    }
                }

                var cardcost = cardType.issue ? card.model.get('cost') : -1* card.model.get('score');
                if (!cardType.issue && card.model.get('score') < card.model.get('maxscore')) {
                    this.gameCredit += 2;
                }
                this.gameCredit += cardcost;
                this.gameCredit -= this.getScore(group);
                this.removeIssueGroup(group);
            } else {
                //only 1 issue allowed
                if (draggable instanceof Issue && droppable instanceof Issue) {
                    draggable.shake();
                    return;
                }

                var issue = draggableType.issue || droppableType.issue;
                var collection = [];
                if (draggableType.evidence) {collection.push(draggableType.evidence);}
                if (droppableType.evidence) {collection.push(droppableType.evidence);}
                var evidence = new Backbone.Collection(collection);

                if (issue) {
                    var issueID = issue.get('issueid');
                    var correctmerge = true;
                    evidence.each(function (model) {
                        if (issueID != model.get('issueid')) {
                            correctmerge = false
                        }
                    });
                    if (!correctmerge) {
                        draggable.shake();
                        return;
                    }
                    this.gameCredit += issue.attributes.cost;
                }
                evidence.each(evidence => {
                    this.gameCredit -= evidence.get('score');
                    if (evidence.get('score') < evidence.get('maxscore')) {
                        this.gameCredit += 2;
                    }
                });
            }
            //create new card
            var issueGroup = this.add(new IssueGroup({
                model: new IssueGroupModel({
                    width: this.width,
                    title: 'Issues and evidence',
                    color: 'success',
                    issue: issue,
                    evidence: evidence
                })
            }));
            //update collections
            this.collection.issueGroup.add(issueGroup);

            //remove old collection occurences
            if(issueGroup.model.get("evidence") != null) {
                issueGroup.model.get("evidence").each(function (groupModel) {
                    var mark;
                    this.collection.evidence.each(function (model) {

                        if (model.attributes.data == groupModel.attributes.body) {
                            mark = model;
                            //return;
                        }
                    }, this)
                    this.collection.evidence.remove(mark);
                }, this)
            }

            if(issueGroup.model.get("issue") != null) {
                this.collection.issues.remove(this.collection.issues.where({data : issueGroup.model.get("issue").attributes.body}));
            }

            this.gameCredit += this.getScore(issueGroup);
            this.bindDraggableEvents(issueGroup);
            issueGroup.position.copy(droppable.position);
            //remove old cards
            draggable.remove();
            droppable.remove();

        },

         getScore: function(card){
             var cost = card.model.get('issue') != null ? card.model.get('issue').get('cost') : 0;
             var evlist = card.model.get('evidence');

             var count = 0;
             var max = 0;
             var penalty = 0;

             evlist.each(function (obj) {
                 count += obj.get('score');
                 let maxScore = obj.get('maxscore');
                 if (max === 0) {
                     max = maxScore;
                 }
                 else if (max !== maxScore) {
                     penalty += 1;
                     if (max > maxScore) {
                         max = maxScore;
                     }
                 }
             });

            if (penalty != 0){
                count -= penalty;
            }
            else if (max != count) {
                count -= 2;
            }
            if(cost > 0) {
                count -= cost;
            }

            return count;
        },


        triggerScoreHint: function() {
            this.scoreHint.position.copy(this.scoreContainer.position);
            //this.scoreHint.scale.copy(Vector2.zeros());

            this.scoreHint.show();

            var animationTime = 900;
            var originalPos = this.scoreContainer.position;
            var newPos = originalPos.clone().add(new Vector2(0, 50));

            var tween = new TWEEN.Tween(this.scoreHint.position)
                .to(newPos,animationTime)
                .easing(TWEEN.Easing.Elastic.Out);

            var tweenBack = new TWEEN.Tween(this.scoreHint.position)
                .to(originalPos,animationTime)
                .delay(3000)
                .easing(TWEEN.Easing.Elastic.In)
                .onComplete(function() {
                    this.scoreHint.hide();
                }.bind(this));

            tween.chain(tweenBack);

            tween.start();
        },

        resolveType: function (view) {

            var type = {};

            if (view instanceof Issue) {
                type['issue'] = view.model;
            }

            if (view instanceof Evidence) {
                type['evidence'] = view.model;
            }

            if (view instanceof IssueGroup) {
                type['issuegroup'] = view.model;
            }

            return type;


        }

    });


});