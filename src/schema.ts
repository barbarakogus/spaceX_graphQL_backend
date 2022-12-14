// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export default `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "SavedLaunch" type defines the queryable fields for every Saved Launch in my data source.

  type SavedLaunch {
    id: ID
    mission_name: String
  }

  type LaunchSite {
    site_name: String
    site_name_long: String
  }

  type Launch {
    id: ID!
    mission_name: String
    launch_date_local: String
    launch_site: LaunchSite
  }

  type Rocket {
    rocket_name: String
    rocket_type: String
  }

  type Links {
    flickr_images: [String]
    video_link: String
    article_link: String
  }

  type LaunchInformation {
    id: ID!
    mission_name: String
    launch_date_local: String
    launch_site: LaunchSite
    details: String
    launch_success: Boolean
    launch_year: String
    rocket: Rocket
    links: Links
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "savedLaunches" query returns an array of zero or more savedLaunches (defined above).
  type Query {
    savedLaunches: [SavedLaunch]
    launchesPast(limit: Int, offset: Int): [Launch]
    launch(id: ID!): LaunchInformation
  }

  type Mutation {
    savedLaunches(id: ID!, mission_name: String!): SavedLaunch
    deleteSavedLaunch(id: ID!): SavedLaunch
  }
`;
