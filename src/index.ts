import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./schema";
import { request, gql } from "graphql-request";

const GET_LAUNCHES_PAST = gql`
  query LaunchesPast($limit: Int, $offset: Int) {
    launchesPast(limit: $limit, offset: $offset) {
      id
      launch_date_local
      launch_site {
        site_name
      }
      mission_name
    }
  }
`;

const GET_LAUNCH_DETAILS = gql`
  query GetLaunchDetails($id: ID!) {
    launch(id: $id) {
      id
      details
      launch_date_local
      launch_site {
        site_name_long
        site_name
      }
      launch_success
      launch_year
      links {
        article_link
        flickr_images
        video_link
      }
      mission_name
      rocket {
        rocket_name
        rocket_type
      }
    }
  }
`;

const savedLaunch = <any>[];

const resolvers = {
  Query: {
    savedLaunches: () => savedLaunch,
    launchesPast: async (_, { limit, offset }) => {
      const data = await request(
        "https://api.spacex.land/graphql/",
        GET_LAUNCHES_PAST,
        {
          limit,
          offset,
        }
      );
      return data.launchesPast;
    },
    launch: async (_, { id }) => {
      const data = await request(
        "https://api.spacex.land/graphql/",
        GET_LAUNCH_DETAILS,
        {
          id,
        }
      );
      return data.launch;
    },
  },
  Mutation: {
    savedLaunches: async (_, { id, mission_name }, { }) => {
      const launch = {
        id: id,
        mission_name: mission_name,
      };
      const ids = savedLaunch.map((fav) => fav.id);
      if (ids.indexOf(launch.id) === -1) {
        savedLaunch.push(launch);
      }
      return launch;
    },
    deleteSavedLaunch: async (_, { id }, { }) => {
      const ids = savedLaunch.map((launch) => launch.id);
      const launchToDelete = ids.indexOf(id);
      savedLaunch.splice(launchToDelete, 1);
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
