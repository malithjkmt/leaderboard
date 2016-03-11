PlayersList =  new Mongo.Collection('players');

if (Meteor.isServer){
    Meteor.publish('thePlayers', function(){
        var currentUserId = this.userId;
        return PlayersList.find({createdBy:currentUserId})
    });
}


if (Meteor.isClient){
    Meteor.subscribe('thePlayers');

    Template.leaderboard.helpers({
        'player': function(){
            var currentUserId = Meteor.userId();
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
        },
        'click .RemovePlayer': function() {
            var r = confirm("Are you sure?");
            if (r == true) {
                var selectedPlayer = Session.get('selectedPlayer');
                console.log(selectedPlayer);
                PlayersList.remove(selectedPlayer);
            }
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event){

            // Prevent default browser form submit
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;

            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
            });
            event.target.playerName.value = "";
        }
    });

}