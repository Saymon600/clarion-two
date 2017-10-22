var members;

module.exports = {

	findMember: function(msg, condition){
		members = msg.channel.guild.members;
        return members.find(function findName(member){
    	    return member.id === condition;
        });
	},

	findIfHasRole: function(msg, memberId, role){
		const member = this.findMember(msg, memberId);
		return member.roles.find(function findRole(memberRole){
    	    return memberRole === role;
        });
	}

}