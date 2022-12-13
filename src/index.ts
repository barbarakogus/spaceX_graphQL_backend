import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./schema";
import { request, gql } from "graphql-request";

// O que quero da SpaceX
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

// const GET_SAVED_LAUNCHES = gql`
//   query SavedLaunches {
//     savedLaunches {
//       id
//       mission_name
//     }
//   }
// `;

// const SAVE_LAUNCH = gql`
//     SaveLaunch($id: ID!, $missionName: String!) {
//         savedLaunches(id: $id, mission_name: $missionName) {
//             id,
//             mission_name
//         } 
//     }
// `;

const savedLaunch = <any>[];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
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
            // data.launchesPast.forEach(element => {
            //     const ids = launches.map(launch => launch.id)
            //     if (ids.indexOf(element.id) === -1)
            //         launches.push(element)
            // });
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
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
