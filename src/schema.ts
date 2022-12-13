// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export default `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.


  #qdo é type é busca 
  type FavoriteMission {
    id: ID
    mission_name: String
  }

  type LaunchSite {
    site_name: String
    site_name_long: String
  }

  type Launch {
    id: ID
    mission_name: String
    launch_date_local: String
    launch_site: LaunchSite
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    favorites: [FavoriteMission]
    launchesPast(offset: Int, limit: Int): [Launch]
  }

  # input BookSave {
  #  title: String!
  #  author: String!
  #}

  type Mutation {
    #books(book: BookSave): Book
    favorites(id: ID!, mission_name: String!): FavoriteMission
  }
`;
