import { gql } from 'graphql-tag';

export const Ship = gql`
  type Mission {
    id: ID!
    flight: String
    name: String
  }

  type Ship {
    id: ID!
    name: String
    class: String
    image: String
    active: Boolean
    missions: [Mission]
  }

  input ShipsInput {
    pagination: PaginationInput!
  }
`;
