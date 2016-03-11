PlayersList =  new Mongo.Collection('players');


if (Meteor.isClient){
    Template.leaderboard.helpers({
        'player': function(){
            return PlayersList.find()
        },
        'totalPlayers': function(){
            return PlayersList.find().count()
        }
    });
}