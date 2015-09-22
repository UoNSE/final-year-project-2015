define(function(require) {
	'use strict';

	//TODO: make cards draggable
	//TODO: make hotspot from data

	var Annyang = require('annyang');
    // var meSpeak = require('mespeak');
	// var Julius = require('julius');

	// debugger;


	// models
	var ButtonModel = require('model/Button');
	var ActionButtonModel = require('model/ActionButton');

	// collections
	var Patients = require('collection/Patients');

	// components
	var Component = require('core/Component');
	var Button = require('component/button/Button');
	var ActionButton = require('component/actionbutton/ActionButton');
	var Tests = require('component/activity/virtualpatient/tests/Tests');
	var Query = require('component/activity/virtualpatient/querypatient/Query');
	var PatientBody = require('component/activity/virtualpatient/patientbody/PatientBody');
	var EvidenceFeed = require('component/activity/virtualpatient/evidencefeed/EvidenceFeed');
	var Chart = require('component/activity/virtualpatient/chart/Chart');
	var Help = require('component/help/Help');

	var Evidence = require('component/activity/issues/card/evidence/Evidence');
	var EvidenceCollection = require('collection/Evidence');
	var EvidenceModel = require('model/Evidence');


	// handlebars templates
	var template = require('text!component/activity/virtualpatient/VirtualPatient.hbs');

	return Component.extend({
		template: template,
		classes: 'virtual-patient',
		styles: 'component/activity/virtualpatient/VirtualPatient.css',

		collection: new Patients(),

		Events: {

			'click #TestBtn': '_toggleTestMenu',
			'click #ChartBtn': '_togglePatientsChart'

			},

		initialize: function () {
			// debugger;
			Component.prototype.initialize.apply(this, arguments);
			this.listenTo(this.collection, 'sync', this.onSync);
			this.collection.fetch();
			this.visiblemenus = [];
			this.collaborative = true;
            // this.voiceintegrated = false;
            this.voiceintegrated = true;
			// this.annyang = new Annyang();
            this.meSpeak = meSpeak;

		},

		onSync: function (collection) {
			// get the patient with the case Id.
			this.patients = this.collection;
			this.patient = this.patients.get(1); // get id.
			this.addComponents();
			this._hideElements();
		},

		addComponents: function() {
			this.testresults = this.patient.get('testresults');
			this.hotspots = this.patient.get('hotspots');
			this.patientbody = this.add(new PatientBody());
			this.patientbody.interactive = true;
			// this.patientbody = this.add(new PatientBody(this.hotspots));
			this.tests = this.add(new Tests(this.testresults));

			// this.julius = new Julius();
			// var sentence = "test";
			// julius.onrecognition = function(sentence) {
			//     console.log(sentence);
			// };


			this.queries = this.add(new Query(this));

			this.EvidenceFeed = this.addEvidenceFeed();
			this.chart = this.add(new Chart({model: this.patient}));
			this.chart.position.set(0,200);
			this.chart.interactive = true;



			this.help = this.add(new Help({
				model: {
				helpContent: 'use the <strong>"Query"</strong> button </br>\
				to ask the patient questions. </br>\
				use the <strong>"Test"</strong> button </br>\
				to run blood/urine/saliva </br>\
				tests on the patint.</br>\
				Use the <strong>"Chart"</strong> button </br>\
				to see the patients details </br>\
				and vital signs.</br>\
				click on parts of the body </br>\
				to reveal scans and other  </br>\
				information related to the area.'}
			}));



			// this.help.scale.set(0.5, 0.5);
			// this.buttons = {};
			this.addButtons();

            if (this.voiceintegrated){
                this.initTTS();
    			this.addVoiceCommands();
            }

		},

        initTTS: function(){
            //    console.log("in init functon");
               if(typeof this.meSpeak !== 'undefined'){
                //    this.meSpeak.loadConfig('https://localhost:7576/lib/mespeak/mespeak_config.json');
                   this.meSpeak.loadConfig('../lib/mespeak/mespeak_config.json');
                   console.log("is mespeak config loaded: "+ this.meSpeak.isConfigLoaded());
                   this.meSpeak.loadVoice("../lib/mespeak/voices/en/en.json");
                   console.log("is mespeak voice loaded: "+ this.meSpeak.isVoiceLoaded());
               }

           },

		addVoiceCommands: function(){

			if (annyang) {

			var that = this;

			  this.commands = {

				'test': function() {
					// debugger;
					console.log('heard "test"');
					that.tests.toggle();
				},
				'query': function() {
					console.log('heard "query"');
					that.queries.toggle();
				},
				'chart': function() {
					console.log('heard "chart"');
					that.chart.toggle();
				},
				'what is the problem': function(){
					if(that.queries.visible){
						console.log('heard "what is the problem"');
						var button = $('#query-btn1');
                        debugger;
                        button.trigger("click");
                        this.meSpeak.speak(button);
					}
				},
				'Where does it hurt': function(){
					if(that.queries.visible){
						console.log('heard "where does it hurt"');
						$('#query-btn2').trigger("click");
					}
				},
				'When did the pain begin': function(){
					if(that.queries.visible){
						console.log('heard "When did the pain begin"');
						$('#query-btn3').trigger("click");
					}
				},
				'Have you noticed any swelling': function(){
					if(that.queries.visible){
						console.log('heard "Have you noticed any swelling"');
						$('#query-btn4').trigger("click");
					}
				},
				'Has your skin been dry': function(){
					if(that.queries.visible){
						console.log('heard "Has your skin been dry"');
						$('#query-btn5').trigger("click");
					}
				},
				'How old are you': function(){
					if(that.queries.visible){
						console.log('heard "How old are you"');
						$('#query-btn5').trigger("click");
					}
				},
				'How have you been sleeping': function(){
					if(that.queries.visible){
						console.log('heard "Have you noticed any swelling"');
						$('#query-btn7').trigger("click");
					}
				},
				'do you have family here': function(){
					if(that.queries.visible){
						console.log('heard "do you have family"');
						$('#query-btn8').trigger("click");
					}
				},
				'urine': function(){
					if(that.tests.visible){
						console.log('heard "urine"');
						$('#test-btn4').trigger("click");
					}
				},


		  	};
			  annyang.addCommands(this.commands);
			  annyang.start({ autoRestart: true, continuous: true});
			  console.log('annyang started');
		  }
		},


		_hideElements: function() {
			this.tests.hide();
			this.queries.hide();
			this.chart.hide();

		},

		addButtons: function () {
			var texts = ['Query', 'Test', 'Chart'];
			var targets = [this.queries, this.tests, this.chart];
			var n = texts.length;
			var offset = 100;

			texts.forEach(function (text, i) {
				var button = this.add(new ActionButton({
					model: new ActionButtonModel({
						text: text,
						id: text + 'Btn',
						// color: danger
					})
				}));
				var scale = i - (n - 1) / 2;
				button.position.set(scale * (offset + offset * 1.1), -300);
				var target = targets[i];
				button.add(target);
				button.on('click', this.onToggle.bind(this,target));
				button.interactive = true;
				// this.buttons.push();

			}.bind(this));
		},

		onToggle: function (toggableTarget) {

			if(this.collaborative != true){
				if(toggableTarget == this.queries){
					this.tests.hide();
					this.chart.hide();
				}
				else if(toggableTarget == this.tests){
					this.queries.hide();
					this.chart.hide();
				}
				else if(toggableTarget== this.chart){
					this.tests.hide();
					this.chart.hide();
				}
			}

			toggableTarget.toggle();

		},

		addEvidenceFeed: function(){

			var Evidencefeed = this.add(new EvidenceFeed());
			var posX = -250;
			var posY = 0;
			Evidencefeed.position.set(posX, posY);
			return this.add(Evidencefeed);
		},

	});

});
