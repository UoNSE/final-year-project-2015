define(function (require) {

    'use strict';

    var $ = require('jquery');

    var ViewController = require('controller/ViewController');
    var Animate = require('behaviour/Animate');
    var MultiTouchManager = require('behaviour/MultiTouchManager');
    var RotateTranslateScaleBehaviour = require('behaviour/RotateTranslateScaleBehaviour');
    return ViewController.extend({

        events: {
            //register drag events by mouseup and mousedown (check with touch input)
            'mousedown .IEcard': 'onDragStart',
            'mouseup .IEcard': 'onDragEnd'

        },

        onAfterRender: function () {

            var Issues = $('#issues').children();
            var Evidencelist = $('#evidences').children();
            var distance = 250;
            var len = Issues.length + Evidencelist.length;
            var i = 0;

            for (; i < Issues.length; i++) {
                var card = $(Issues[i]);
                MultiTouchManager.getInstance().addElementRTS(card);
                //card.css({"color": "black"/*, "width": (card.text().length * 19) + "px", "height":64 + "px", "word-wrap":"break-word"*/});
                var angle =  2 * Math.PI * (i / len);
                Animate.scale(card, {
                    delay: i * 50,
                    animate: {
                        top: (distance * Math.cos(angle)) - 150,
                        left: (distance * Math.sin(angle))
                    }
                });
            }
            for (var l=0; i < len; i++, l++) {
                var card = $(Evidencelist[l]);
                MultiTouchManager.getInstance().addElementRTS(card);
                var angle = 2 * Math.PI * (i / len);
                //card.css({"color": "black"/*, "width": (card.text().length * 19) + "px", "height":64 + "px", "word-wrap":"break-word"*/});
                Animate.scale(card, {
                    delay: i * 50,
                    animate: {
                        top: (distance * Math.cos(angle)) -150,
                        left: (distance * Math.sin(angle))
                    }
                });
            }
        },

        onDragStart: function() {

            $("#menu").show();
            /*var menu = $( "#menu" );
             menu.show();
             Animate.scale( menu, {
             delay: 1,
             animate: {
             duration:10,
             top:300,
             left:0
             }
             });*/
        },

        onDragEnd: function(){

            //check collisions
            //get btn pos
            var pos=jQuery(event.target).offset();
            var target = $(event.target);
            var delbtn = $( "#delbtn");
            var splitbtn = $( "#splitbtn");

            //HACK:ascend until the 'true' parent is found
            while ( !target.hasClass("IEcard")){
                target = target.parent();
            }

            //check for card deletion
            //console.log(deldist);
            if( touchOverElement(delbtn,event) ){
                console.log("delete");
                target.remove();
            }
            else if ( touchOverElement(splitbtn,event) ){

                if ( !target.hasClass("merged") ){
                    return;
                }

                console.log("split");

                var children = target.children(".panel-body");

                //create the respective issue & evidence
                $("#issues").html()( $("#issues").html() + createCard( "Issue", children[0].text ) );
                $("#evidences").html()( $("#evidences").html() + createCard( "Evidence", children[1].text ) );

                //delete the pair
                target.remove();

                //add RTS
                var list = $("#issues").children();
                for(var i=0; i<list.length;i++){
                    var card = list[i];
                    MultiTouchManager.getInstance().addElementRTS(card);
                }

                //add RTS
                var list = $("#evidences").children();
                for(var i=0; i<list.length;i++){
                    var card = list[i];
                    MultiTouchManager.getInstance().addElementRTS(card);
                }
            }
            else {
                //check for card merging

                var list;
                if (target.hasClass("issue")) {
                    if ( target.hasClass("merged")){
                        return;
                    }
                    else {
                        //check all evidence cards
                        list = $('#evidences').children();
                    }
                }
                else {
                    //check all issue cards
                    list = $('#issues').children();
                }
                for (var i = 0; i < list.length; i++) {
                    //div
                    var card = $(list[i]);
                    if (!card.hasClass("merged")) {

                        if ( touchOverElement(card,event) ){
                            console.log("merged");
                            //add "merged" class to div

                            var issue;
                            var evidence;

                            //update card text
                            if (target.hasClass("issue")) {
                                issue = target;
                                evidence = card;
                            }
                            else {
                                issue = card;
                                evidence = target;
                            }

                            evidence.children().each( function() {
                                console.log( this );
                                issue.append( this );
                            });

                            issue.removeClass("panel-info");
                            issue.addClass("panel-success");
                            issue.addClass("merged");

                            //This is dirty, I know
                            issue.height( 200 );

                            //remove old card
                            evidence.remove();

                            break;
                        }
                    }
                }
            }

            //hide menu
            $( "#menu").hide();
            /*var menu = $( "#menu" );
             Animate.scaleOut( menu, {
             delay: 10,
             animate: {
             duration:5,
             top:-400,
             left:0,
             complete:function(){
             //menu.hide();
             }
             },
             }, "fast");*/

        }

    });

    function touchOverElement( $element, event ) {
        var touchX = event.pageX;
        var touchY = event.pageY;

        var x1 = $element.offset().left;
        var x2 = x1 + $element.width();

        var y1 = $element.offset().top;
        var y2 = y1 + $element.height();

        console.log( x1 + "<" + touchX + "<" + x2 + " && " + y1 + "<" + touchY + "<" + y2);

        if ( touchX > x1 && touchX < x2 && touchY > y1 && touchY < y2 ){
            return true;
        }
        else {
            return false;
        }
    }

    function createCard( cardType, content ){
        var panelType =  ( cardType === "Issue" ) ? "info" : "danger";
        return "<div class='panel panel-" + panelType + " abs-center issue IEcard' style='width: 300px; height: 100px'><div class='panel-heading'><h3 class='panel-title'>" + cardType + "</h3></div><div class='panel-body'>" + content + "</div></div>";
    }

});