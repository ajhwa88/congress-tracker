const API_KEY = 'NiVcYMT6ivJBpFXQBYLLaeTIxHdKkm9alXGNjOdb';
const BASE_URL = 'https://api.congress.gov/v3';

const headers = {
  'Accept': 'application/json'
};

export const congressApi = {
  // Get all current members of Congress
  getAllMembers: async () => {
    try {
      let allMembers = [];
      let offset = 0;
      const limit = 250;
      let hasMore = true;

      // Fetch all pages of members
      while (hasMore) {
        const response = await fetch(
          `${BASE_URL}/member?api_key=${API_KEY}&limit=${limit}&offset=${offset}&format=json`,
          { headers }
        );
        const data = await response.json();
        console.log(`Fetching page with offset ${offset}:`, data);

        const members = data?.members || [];
        if (members.length === 0) {
          hasMore = false;
        } else {
          allMembers = [...allMembers, ...members];
          offset += limit;
        }
      }

      console.log('Total members found:', allMembers.length);

      // Format the data
      const processedMembers = allMembers.map(member => ({
        id: member.bioguideId,
        name: member.name || `${member.firstName} ${member.lastName}`,
        state: member.state,
        party: member.party,
        chamber: member.chamber,
        twitterHandle: member.twitterAccount ? `@${member.twitterAccount}` : 'N/A',
        profileImage: `https://www.congress.gov/img/member/${member.bioguideId}_200.jpg`,
        biography: `${member.chamber === 'Senate' ? 'Senator' : 'Representative'} from ${member.state}`,
        phoneNumber: member.phone,
        district: member.district
      }));

      console.log('Final processed members:', processedMembers);
      return processedMembers;

    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  // Get specific member details
  getMemberDetails: async (memberId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/member/${memberId}?api_key=${API_KEY}&format=json`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch member details');
      }

      const data = await response.json();
      console.log('Raw member data:', data);
      
      const memberData = data?.member;
      if (!memberData) {
        throw new Error('Member data not found');
      }

      // Get the most recent party from partyHistory
      const currentParty = memberData.partyHistory?.[0]?.partyName || 'Unknown';

      // Get the most recent term to determine current chamber
      const currentTerm = memberData.terms?.[0];
      const chamber = currentTerm?.chamber || 'Unknown';

      return {
        id: memberId,
        name: memberData.directOrderName || `${memberData.firstName} ${memberData.lastName}`,
        state: memberData.state,
        party: currentParty,
        chamber: chamber,
        district: currentTerm?.district,
        profileImage: memberData.depiction?.imageUrl || null
      };
    } catch (error) {
      console.error('Error fetching member details:', error);
      throw error;
    }
  },

  // Get member's voting record
  getMemberVotes: async (memberId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/member/${memberId}/votes?api_key=${API_KEY}`,
        { headers }
      );
      const data = await response.json();
      return data.votes || [];
    } catch (error) {
      console.error('Error fetching member votes:', error);
      throw error;
    }
  },

  // Get recent bills
  getRecentBills: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/bill?api_key=${API_KEY}`,
        { headers }
      );
      const data = await response.json();
      return data.bills;
    } catch (error) {
      console.error('Error fetching recent bills:', error);
      throw error;
    }
  }
}; 