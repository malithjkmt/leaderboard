PlayersList =  new Mongo.Collection('players');


if (Meteor.isClient){
    Template.leaderboard.helpers({
        'player': function(){
            return PlayersList.find()
        },
        'selectedClass': function(){
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if(playerId == selectedPlayer){
                return "selected"
            }
        }
    });

    Template.leaderboard.events({
        'click .player': function() {
            var playerId = this._id;  // get the unique id of clicked li element
            Session.set('selectedPlayer', playerId);   // store it in the current session
        }
    });

}