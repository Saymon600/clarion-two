var members;

module.exports = {

	findMember: function(msg, condition){
		members = msg.channel.guild.members;
        return members.find(function findName(member){
    	    return member.id === condition;
        });
	}

}