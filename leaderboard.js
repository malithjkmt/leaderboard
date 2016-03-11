PlayersList =  new Mongo.Collection('players');


if (Meteor.isClient){
    Template.leaderboard.helpers({
        'player': function(){
            return PlayersList.find({}, {sort: {score:-1, name:1}})
        },
        'selectedClass': function(){
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if(playerId == selectedPlayer){
                return "selected"
            }
        },
        'showSelectedPlayer': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne(selectedPlayer)
        }
    });

    Template.leaderboard.events({
        'click .player': function() {
            var playerId = this._id;  // get the unique id of clicked li element
            Session.set('selectedPlayer', playerId);   // store it in the current session
        },
        'click .increment': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc: {score: 5}});
        },
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc:{score: -5}} );
        }
    });

}