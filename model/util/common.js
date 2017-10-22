module.exports = {

	findMember: function(msg, id){
        return msg.channel.guild.members.find((member) =>{
    	    return member.id === id;
        });
	},

	findMemberByName: function(msg, name){
        return msg.channel.guild.members.find((member) =>{
    	    return member.username === name || member.nick === name;
        });
	},

	findIfHasRole: function(msg, memberId, role){
		return this.findMember(msg, memberId).roles.find((memberRole) =>{
    	    return memberRole === role;
        });
	},

	findMemberWithRole: function(msg, role){
		return msg.channel.guild.members.find((member) =>{
			return member.roles.find((memberRole) =>{
				return memberRole === role
			})
		})
	}
}