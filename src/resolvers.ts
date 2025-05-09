const resolvers = {
  Query: {
    teamAthlete: (parent, args, content, info) => {
      return {
        footballPassingStats: loadFootballPassingStats(),
      };
    },

    footballPassingStats: (parent, args, content, info) => {
      return loadFootballPassingStats();
    },
  },
  TeamAthlete: {
    footballPassingStats: () => {
      return loadFootballPassingStats();
    },
    footballStats: () => {
      return loadFootballStats();
    },
  },

  // FootballPassingStats | FootballRushingStats | FootballReceivingStats
  FootballStats: {
    __resolveType(obj, context, info) {
      if (obj.passing_stats) {
        return "FootballPassingStats";
      }
      if (obj.fumbles) {
        return "FootballRushingStats";
      }
      if (obj.receptions) {
        return "FootballReceivingStats";
      }
      return "FootballPassingStats"; // Type resolution failed
    },
  },
};

const loadFootballPassingStats = () => {
  return {
    passing_stats: true,
    attempted: 111,
    completed: 15,
  };
};

const loadFootballStats = () => {
  return [
    {
      passing_stats: true,
      attempted: 111,
      completed: 15,
      fumbles: 3,
    },
    {
      rushing_stats: true,
      attemptedYards: 11,
      touchdowns: 5,
      fumbles: 3,
    },
    {
      recieving_stats: true,
      targets: 31,
      receptions: 15,
      twoPointConv: 3,
    },
  ];
};

export default resolvers;
