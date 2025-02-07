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
        `${BASE_URL}/member/${memberId}?api_key=${API_KEY}`,
        { headers }
      );
      const data = await response.json();
      const member = data.member;
      
      if (!member) {
        throw new Error('Member not found');
      }

      return {
        id: member.bioguideId,
        name: member.name || `${member.firstName} ${member.lastName}`,
        state: member.state,
        party: member.party,
        chamber: member.chamber,
        twitterHandle: member.twitterAccount ? `@${member.twitterAccount}` : 'N/A',
        profileImage: `https://www.congress.gov/img/member/${memberId}_200.jpg`,
        biography: `${member.chamber === 'Senate' ? 'Senator' : 'Representative'} from ${member.state}`,
        phoneNumber: member.phone,
        district: member.district
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