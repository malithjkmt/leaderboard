PlayersList =  new Mongo.Collection('players');

if (Meteor.isServer){
    Meteor.publish('thePlayers', function(){
        var currentUserId = this.userId;
        return PlayersList.find({createdBy:currentUserId})
    });

    Meteor.methods({
        'insertPlayerData': function(playerNameVar){
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
            });
        },
        'removePlayer': function(selectedPlayer){
            var currentUserId = Meteor.userId();
            PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
        },
        'updateScore': function(selectedPlayer, scoreValue){
            var currentUserId = Meteor.userId();
            PlayersList.update({_id: selectedPlayer, createdBy: currentUserId}, {$inc: {score: scoreValue} });
        }
    });
}


if (Meteor.isClient){
    Meteor.subscribe('thePlayers');

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
            Meteor.call('updateScore',selectedPlayer, 5);
        },
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore',selectedPlayer, -5);
        },
        'click .RemovePlayer': function() {
            var r = confirm("Are you sure?");
            if (r == true) {
                var selectedPlayer = Session.get('selectedPlayer');
                Meteor.call('removePlayer', selectedPlayer);
            }
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event){

            // Prevent default browser form submit
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            event.target.playerName.value = "";
            Meteor.call('insertPlayerData', playerNameVar);
        }
    });

}
