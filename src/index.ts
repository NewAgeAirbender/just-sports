import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";

import jeffsResolvers from "./jeffsResolvers.js";

const typeDefs = `#graphql
scalar DateTime

type Query {
  league: League!
  sport: Sport!
  getTeamsforSport(sport: ID): Team
  getBasketballStats: BasketballStats
  getHockeyStats: HockeyStats
  getLacrosseStats: LacrosseStats
  getSoccerStats: SoccerStats
  getVolleyballStats: VolleyballStats
  team: Team!
  event: Event!
  game: Event!
  getGameFromId(id: ID!): Event!
  getTeamFromId(id: ID!): Team!
}

union Organization =
  | League
  | Class
  | SportSection
  | SportSubsection
  | Conference
  | ConferenceDivision

type League {
  id: ID!
  name: String!
  teams: [Team!]!
  classes: [Class!]!
}

type Class {
  id: ID!
  name: String!
  teams: [Team!]!
  sections: [SportSection!]!
}

type SportSection {
  id: ID!
  name: String!
  teams: [Team!]!
  subsections: [SportSubsection!]!
}

type SportSubsection {
  id: ID!
  name: String!
  teams: [Team!]!
  league: League!
}

type Conference {
  id: ID!
  name: String!
  teams: [Team!]!
  league: League!
}

type ConferenceDivision {
  id: ID!
  name: String!
  teams: [Team!]!
}

enum Gender {
  BOYS
  GIRLS
  COMBINED
}

enum Season {
  FALL
  WINTER
  SPRING
}

type SportSeason {
  year: String!
  season: Season!
}

# per season
type Team {
  id: ID!
  name: String!
  gender: Gender
  sportID: String!

  league: League!
  class: Class!
  section: SportSection!
  subsection: SportSubsection!
  conference: Conference!
  conferenceDivision: ConferenceDivision!
  schools: [School!]!
  stateRanking: Int
  stribRanking: Int
  standings: Int

  season: SportSeason!

  events: [SportingEventInterface!]!
  record: RecordInterface!
  roster: [TeamAthlete!]!
  leaders: [TeamAthlete!]!
}

type TeamAthlete {
  athlete: Athlete!
  team: Team!
  position: [String]!
  jerseyNumber: String
  grade: Int
  season: SportSeason!
}

type Athlete {
  id: ID!
  firstName: String!
  lastName: String!
  middleName: String
  photo: String!
  nickNames: [String!]!
}

type School {
  id: ID!
  name: String!
  teams: [Team!]!
  url: String
}

type Sport {
  id: ID!
  name: String!
}

enum GAME_TYPE {
  PLAYOFF
  REGULAR_SEASON
}

interface SportingEventInterface {
  id: ID!
  date: DateTime!
  teams: [Team!]!
  location: String
  homeTeam: Team
  awayTeams: [Team!]!
  sport: Sport!
  gameType: GAME_TYPE
  paywalled: Boolean
  homeFinalScore: Int
  awayFinalScore: Int
  liveStream: LiveSteam

  eventOrganizers: [Organization!]!
}

type Event implements SportingEventInterface {
  id: ID!
  date: DateTime!
  teams: [Team!]!
  location: String
  homeTeam: Team
  awayTeams: [Team!]!
  sport: Sport!
  gameType: GAME_TYPE
  paywalled: Boolean
  homeFinalScore: Int
  awayFinalScore: Int
  liveStream: LiveSteam

  eventOrganizers: [Organization!]!
}

enum LIVE_STREAM_STATUS {
  LIVE
  UPCOMING
  ENDED
}

type LiveSteam {
  id: ID!
  url: String!
  headline: String!
  description: String
  startTime: DateTime!
  expectedEndTime: DateTime
  endTime: DateTime
  status: LIVE_STREAM_STATUS
}


interface RecordInterface {
    wins: Int!
    losses: Int!
    ties: Int
    points: Int
}

# Basketball & Lacrosse &
# Baseball/Softball: sub 'points' for 'runs' on frontend
type BaseRecord implements RecordInterface {
    wins: Int!
    losses: Int!
    ties: Int
    points: Int
}

type FootballRecord implements RecordInterface {
    wins: Int!
    losses: Int!
    ties: Int
    points: Int

    pointsPerGame: Float
    gamesPlayed: Int
}

type VolleyballRecord implements RecordInterface {
    wins: Int!
    losses: Int!
    ties: Int
    points: Int

    sets: Int
}

# sub 'points' for 'goals' on frontend
type SoccerRecord implements RecordInterface {
    wins: Int!
    losses: Int!
    ties: Int
    points: Int

    pointsPerGame: Float
    yellowCards: Int
    redCards: Int
}

type HockeyRecord implements RecordInterface {
    wins: Int!
    losses: Int!
    ties: Int
    points: Int

    overtimeLosses: Int
    shootoutAttempts: Int
    shootoutGoals: Int
    shootoutPoints: Int
}

enum BASEBALL_POSITIONS {
    CATCHER
    FIELDER 
    PITCHER
    BATTER
}
    
type CatcherStats {
    passedBalls: Int
    stolenBasesAgainst: Int
    caughtStealing: Int
    caughtStealingPercent: Float
}

type FielderStats {
    gamesPlayed: Int
    inningsPlayed: Int

    totalChances: Int
    putouts: Int
    assists: Int
    errors: Int
    doublePlays: Int
    gamesStarted: Int
    fieldingPercent: Float
    rangeFactor: Float
}

type PitcherStats {
    gamesPlayed: Int
    wins: Int
    losses: Int
    saves: Int
    saveOpportunities: Int
    shutouts: Int
    inningsPlayed: Int
    hits: Int
    runs: Int
    earnedRuns: Int
    earnedRunsPercent: Float
    homeRuns: Int
    baseOnBalls: Int
    intentionalBaseOnBalls: Int
    strikeouts: Int
    qualityStarts: Int
    gamesStarted: Int
    completeGames: Int
    hitBatters: Int
    pitchCount: Int
    wildPitch: Int
    strikesThrown: Int
    ballsThrown: Int
    atBats: Int
    battingPercentAgainst: Float
    walksPerInning: Float
}

type BatterStats {
    gamesPlayed: Int
    atBats: Int
    runs: Int
    hits: Int
    singles: Int
    doubles: Int
    triples: Int
    homeRuns: Int
    totalBases: Int
    baseOnBalls: Int
    intentionalBaseOnBalls: Int
    runsBattedIn: Int
    hitByPitch: Int
    strikeouts: Int
    stolenBases: Int
    caughtStealing: Int
    groundDoublePlay: Int
    battingPercent: Float
    onBasePercent: Float
    onBasePlus: Float
    sluggingPercent: Float
    sacrificeFly: Int
    sacrificeHit: Int
    plateAppearances: Int

    # Maybe?
    battingOrder: Int
    pitchHitter: Boolean
}

type BasketballStats {
    player: PlayerStats
    scoring: ScoringStats
    rebound: ReboundStats
    misc: MiscStats
}

type PlayerStats {
    gamesPlayed: Int
    gamesStarted: Int
    minutesPlayed: Int
    minutesPerGame: Float
}

type ScoringStats {
    gamesPlayed: Int
    pointsPerGame: Float
    totalPoints: Int
    gameHighPoints: Int

    fieldGoalsMade: Int
    fieldGoalsAttempted: Int
    fieldGoalsPercent: Float

    freeThrowsMade: Int
    freeThrowsAttempted: Int
    freeThrowsPercent: Float

    threePointMade: Int
    threePointAttempted: Int
    threePointPercent: Float
}

type ReboundStats {
    gamesPlayed: Int
    reboundsPerGame: Float

    offensiveRebounds: Int
    defensiveRebounds: Int
    totalRebounds: Int
}

type MiscStats {
    gamesPlayed: Int

    assists: Int
    assistsPerGame: Float

    turnovers: Int
    turnoversPerGame: Float
        
    steals: Int
    stealsPerGame: Float

    blocks: Int
    blocksPerGame: Float

    fouls: Int
    foulsPerGame: Float
    technicalFouls: Int
}

type FootballTeamStats {
    gamesPlayed: Int
    totalYards: Int

    firstDown: Int
    thirdDownAttempted: Int
    thirdDownCompleted: Int
    thirdDownPercent: Float
    fourthDownAttempted: Int
    fourthDownCompleted: Int
    fourthDownPercent: Float

    timePosessed: Float
    
    penalties: Int
    penaltyYards: Int
}

type FootballPassingStats {
    gamesPlayed: Int
    totalYards: Int

    yardsPerGame: Float
    averageYards: Float
    
    attempted: Int
    completed: Int
    percent: Float

    touchdowns: Int
    interceptions: Int
    
    quarterbackRating: Float

    sacks: Int
    yardsLostSacks: Int
    twoPointConv: Int
}

type FootballRushingStats {
    gamesPlayed: Int
    totalYards: Int

    attemptedYards: Int
    averageYards: Float

    yardsPerGame: Float

    touchdowns: Int
    fumbles: Int
    twoPointConv: Int
}

type FootballReceivingStats {
    gamesPlayed: Int
    totalYards: Int
    averageYards: Float
    yardsPerGame: Float

    receptions: Int
    touchdowns: Int
    twoPointConv: Int
    yardsAfterCatch: Int
    targets: Int
}

type FootballDefensiveStats {
    gamesPlayed: Int

    soloTackle: Int
    assistTackle: Int
    tacklesForLoss: Int
    totalTackles: Int

    sacks: Int
    fumbleRecovery: Int
    forcedFumble: Int
    fumbleTDReturn: Int

    interception: Int
    interceptionTDReturn: Int

    safties: Int
    blockedKicks: Int
    blockedKickTDReturn: Int
    
    passesDefended: Int
    totalDefensiveTD: Int
}

type FootballReturnStats {
    gamesPlayed: Int

    returns: Int
    yards: Int
    averageYards: Float

    touchdowns: Int
}

type PuntReturnStats {
    gamesPlayed: Int

    returns: Int
    yards: Int
    averageYards: Float

    touchdowns: Int
    fairCatches: Int
}

type FootballPuntingStats {
    gamesPlayed: Int

    yards: Int
    punts: Int
    averageYards: Float

    touchback: Int
    puntsInTwenty: Int
    blockedPunts: Int
}

type FootballKickingStats {
    gamesPlayed: Int

    tensRangeAttempted: Int
    tensRangeMade: Int
    twentiesRangeAttempted: Int
    twentiesRangeMade: Int
    thirtiesRangeAttempted: Int
    thirtiesRangeMade: Int
    fourtiesRangeAttempted: Int
    fourtiesRangeMade: Int
    fiftiesPlusAttempted: Int
    fiftiesPlusMade: Int

    fieldGoalsAttempts: Int
    fieldGoalsMade: Int
    fieldGoalsPercent: Float

    extraPointAttempts: Int
    extraPointMade: Int
    extraPointPercent: Float

    rouge: Int
}

union HockeyStats = HockeyTeamStats | HockeyGoalieStats | SkaterStats

type HockeyTeamStats {
    gamesPlayed: Int

    goalsPerGame: Float
    goalsAgainstPerGame: Float

    powerPlays: Int
    powerPlaysPercent: Float
    powerPlaysGoalsAllowed: Int

    penaltyKills: Int
    penaltyKillsPercent: Float
}

type HockeyGoalieStats {
    gamesPlayed: Int
    minutesPlayed: Int

    wins: Int
    losses: Int
    ties: Int

    goalsAgainst: Int
    goalsAgainstAverage: Float
    
    shutouts: Int
    saves: Int
    savesPercent: Float
    shotsOnGoal: Int
    shootoutLoss: Int
    mvp: Boolean
}

type SkaterStats {
    gamesPlayed: Int
    goals: Int
    assists: Int
    points: Int
    shotsOnGoal: Int
    shootoutWon: Int
    shootingPercent: Float
    
    powerPlayGoals: Int
    powerPlayAssists: Int

    shortHandedAssists: Int
    shortHandedGoals: Int

    penalties: Int
    penaltiesMinutes: Int

    faceoffsWon: Int
    faceoffsLost: Int

    turnovers: Int
    hits: Int
    blockedShots: Int
    plusMinus: Int

    mvp: Boolean
    gameWinningGoals: Int
    pointsPerGame: Float
    firstGoal: Int
}

union LacrosseStats = LacrosseTeamStats | RunnerStats | LacrosseGoalieStats

type LacrosseTeamStats {
    powerPlaysAttempted: Int
    powerPlayPercent: Float
    powerPlayMinutes: Float

    penaltyKills: Int
    penaltyKillGoalsAllowed: Int
    penaltyKillPercent: Float

    clears: Int
    clearsFailed: Int
    rides: Int
}

type RunnerStats {
    gamesPlayed: Int
    goals: Int
    twoPointGoals: Int
    assists: Int
    penalties: Int
    pentaltyMinutes: Int
    
    powerPlayGoals: Int
    shortHandGoals: Int
    gameWinningGoals: Int

    goalsPerGame: Float
    pointsPerGame: Float
    penaltyMinutesPerGame: Float

    shotsOnGoal: Int
    shotsOffTarget: Int
    shotsAttempted: Int

    shootingPercent: Float
    shotsOnGoalPercent: Float
    shotsOnGoalPerGame: Float

    groundBalls: Int
    looseBalls: Int
    turnovers: Int
    forcedTurnovers: Int
    takeaways: Int
    
    faceoffs: Int
    faceoffsWon: Int
    faceoffsLost: Int
    faceoffsPercent: Float

    mvp: Boolean
    drawControls: Int
}

type LacrosseGoalieStats {
    gamesPlayed: Int
    minutes: Float
    wins: Int!
    losses: Int!
    ties: Int!

    goalsAgainst: Int
    shotsOnGoalsAgainst: Int
    twoPointGoalsAgainst: Int

    goalsAgainstPercent: Float

    saves: Int
    savesPercent: Float

    groundBalls: Int
    looseBalls: Int
    shutouts: Int
    mvp: Boolean
}

union SoccerStats = GoalkeeperStats | IndividualStats

type SoccerTeamStats {
    ballPossession: Int
}

type GoalkeeperStats {
    gamesPlayed: Int
    minutesPlayed: Int

    goalsAgainst: Int
    goalsAverage: Float

    saves: Int
    penaltySaves: Int
    freeKickSaves: Int
    cornerSaves: Int
    savePercent: Float

    yellowCards: Int
    redCards: Int

    fouls: Int
}

type IndividualStats {
    gamesPlayed: Int
    minutesPlayed: Int
    goals: Int

    assists: Int

    shots: Int
    shotsOnGoal: Int
    shotsPercent: Float

    cornerKicks: Int
    crosses: Int
    fastBreak: Int

    fouls: Int
    foulsAgainst: Int

    headers: Int
    longPasses: Int
    offsides: Int

    freeKicks: Int
    directFreeKicks: Int
    indirectFreeKicks: Int
    freeKickGoals: Int

    penalties: Int
    penaltyKickGoals: Int

    tackles: Int
    tacklesAgainst: Int

    yellowCards: Int
    yellowCardsStanding: Int

    redCards: Int
    redCardsStanding: Int

    ownGoals: Int
    gameWinningGoals: Int
    totalPoints: Int
}

type VolleyballStats {
    attack: AttackStats
    set: SetStats
    serve: ServesStats
    defense: DefenseStats
    block: BlockStats
    serviceReception:ServiceReceptionStats
    general: GeneralStats
}
    
type AttackStats {
    kills: Int
    errors: Int
    attempts: Int

    killsPercent: Float
    killsSet: Float
}

type ServesStats {
    aces: Int
    errors: Int
    attempts: Int

    assesSet: Float
    servesPercent: Float
}

type SetStats {
    assists: Int
    assistsSet: Float
}

type DefenseStats {
    digs: Int
    digsSet: Float
}

type BlockStats {
    soloBlocks: Int
    assistBlocks: Int
    errors: Int
    total: Int
    blocksSet: Float
}

type ServiceReceptionStats {
    errors: Int
    receptions: Int
}

type GeneralStats {
    errors: Int
    setsPlayed: Int
}
`;

const resolvers = {
  Query: {
    // getTeamsForSport: () => {
    //     return
    // }
    getGameFromId: (parent, args, content, info) => {
      // getGameFromId: () => {
      return { id: args.id };
    },
  },
};

// Just need to pass resolvers in with typeDefs when that's ready
const server = new ApolloServer({ // { typeDefs, resolvers }
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs, resolvers: jeffsResolvers }),
    preserveResolvers: true,
  }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀  Server ready at: ${url}`);
