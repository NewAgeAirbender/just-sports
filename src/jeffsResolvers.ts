import game42559237 from "./data/sample_game_responses/football_game_42559237.js";
import game42558948 from "./data/sample_game_responses/football_game_42558948.js";
import game42559134 from "./data/sample_game_responses/football_game_42559134.js";
import game42559186 from "./data/sample_game_responses/football_game_42559186.js";
import game42559396 from "./data/sample_game_responses/football_game_42559396.js";
import game42559689 from "./data/sample_game_responses/football_game_42559689.js";

import team64982 from "./data/sample_team_responses/team_64982_E.js";
import team64980 from "./data/sample_team_responses/team_64980_B.js";
import team65020 from "./data/sample_team_responses/team_65020_R.js";
import team65090 from "./data/sample_team_responses/team_65090_H.js";

import team_instance_9762989 from "./data/sample_team_instance_responses/team_instance_9762989_E.js";

const jeffsResolvers = {
  Query: {
    getGame: (parent, args, content, info) => {
      return gameObject(args.id);
    },
    getTeam: (parent, args, content, info) => {
      return teamObject(args.id);
    },
    getTeamInstance: (parent, args, content, info) => {
      return teamInstanceObject(args.id);
    },
  },
};

const gameObject = (id: string) => {
  switch (id) {
    case "42559237":
      return convertSEtoSV_game(game42559237);
      break;
    case "42558948":
      return convertSEtoSV_game(game42558948);
      break;
    case "42559134":
      return convertSEtoSV_game(game42559134);
      break;
    case "42559186":
      return convertSEtoSV_game(game42559186);
      break;
    case "42559396":
      return convertSEtoSV_game(game42559396);
      break;
    case "42559689":
      return convertSEtoSV_game(game42559689);
      break;
    default:
      console.log("Found nothing for game id: " + id);
  }
  // By default we return no data and mock data will be filled in
  return {};
};

const convertSEtoSV_game = (gameObjectSE) => {
  return {
    id: gameObjectSE.id,
    homeTeam: {
      id: gameObjectSE.home_team_id,
      name: gameObjectSE.home_team_name,
    },
    homeFinalScore: gameObjectSE.home_team_score_api,
    awayTeams: [
      {
        id: gameObjectSE.away_team_id,
        name: gameObjectSE.away_team_name,
      },
    ],
    awayFinalScore: gameObjectSE.away_team_score_api,
  };
};

const teamObject = (id: string) => {
  switch (id) {
    case "64982":
      return convertSEtoSV_team(team64982);
      break;
    case "64980":
      return convertSEtoSV_team(team64980);
      break;
    case "65020":
      return convertSEtoSV_team(team65020);
      break;
    case "65090":
      return convertSEtoSV_team(team65090);
      break;
    default:
      console.log("Found nothing for team id: " + id);
  }
  // By default we return no data and mock data will be filled in
  return {};
};

const convertSEtoSV_team = (teamObjectSE) => {
  return {
    id: teamObjectSE.id,
    name: teamObjectSE.name,
    gender: teamObjectSE.gender,
    sportID: teamObjectSE.sport_id,
    // season: teamObjectSE.current_subseason_ids[0],

    // teamInstanceID: teamObjectSE.subseason_team_instance_mapping.team_instance_id,
    //    where teamObjectSE.subseason_team_instance_mapping.subseason_id ==
    //            teamObjectSE.current_subseason_ids[0]
  };
};

const teamInstanceObject = (id: string) => {
  switch (id) {
    case "9762989":
      return convertSEtoSV_team_instance(team_instance_9762989);
      break;
    default:
      console.log("Found nothing for team instance id: " + id);
  }
  // By default we return no data and mock data will be filled in
  return {};
};

const convertSEtoSV_team_instance = (teamInstanceObjectSE) => {
  return {
    id: teamInstanceObjectSE.id,
    name: teamInstanceObjectSE.name,

    sportID: teamInstanceObjectSE.team.sport_id,

    // We'll need to do something more sophisticated to have 
    // a Class resolver that can map "Class 6A" onto a Class object
    // and a Section resolver that can map "Section 3AAAAAA" onto a SportSection object
    class: teamInstanceObjectSE.tag_list.find(tag => tag.includes("Class")),
    section: teamInstanceObjectSE.tag_list.find(tag => tag.includes("Section")),

    // Need to map male/female onto enum Gender BOYS/GIRLS
    // gender: (teamInstanceObjectSE.gender == 'male_') ? 'BOYS' : null

    // season: teamObjectSE.current_subseason_ids[0],
    // teamInstanceID: teamObjectSE.subseason_team_instance_mapping.team_instance_id,
    //    where teamObjectSE.subseason_team_instance_mapping.subseason_id ==
    //            teamObjectSE.current_subseason_ids[0]
  };
};


export default jeffsResolvers;
