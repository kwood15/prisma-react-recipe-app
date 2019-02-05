import { gql } from 'apollo-boost';

export default gql`
  mutation AddRecipe(
    $directions: String!
    $title: String!
    $ingredients: String!
    $published: Boolean
  ) {
    createRecipe(
      data: {
        directions: $directions
        title: $title
        ingredients: $ingredients
        published: $published
      }
    ) {
      id
    }
  }
`;
