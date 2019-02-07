import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { Card, Col, Row, Empty, Spin, Button, notification } from 'antd';

// components
import ViewRecipeModal from '../../components/Modals/ViewRecipeModal';
import AddRecipeModal from '../../components/Modals/AddRecipeModal';
import RecipeCard from '../../components/RecipeCard';

// queries
import GetAllPublishedRecipes from '../../graphql/queries/GetAllPublishedRecipes';
import GetSingleRecipe from '../../graphql/queries/GetSingleRecipe';

// mutations
import UpdateRecipe from '../../graphql/mutations/UpdateRecipe';
import AddNewRecipe from '../../graphql/mutations/AddNewRecipe';

const initialState = {
  form: {
    directions: '',
    ingredients: '',
    title: '',
    published: false
  },
  notification: {
    notificationOpen: false,
    message: '',
    title: '',
    type: ''
  },
  viewModalOpen: false,
  addModalOpen: false,
  recipeData: {},
  recipeId: '',
  isEditing: false
};

class AllRecipesContainer extends Component {
  state = initialState;

  componentDidUpdate() {
    this.renderNotification();
  }

  handleResetState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    event.persist();

    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value
      }
    }));
  };

  handleChecked = checked => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        published: checked
      }
    }));
  };

  handleOnClick = recipeId => {
    const { client } = this.props;
    client
      .query({
        query: GetSingleRecipe,
        variables: {
          recipeId
        }
      })
      .then(res => {
        this.setState({
          viewModalOpen: true,
          recipeData: res.data.recipe
        });
      });
  };

  handleOpenAddModal = () => {
    this.setState({
      addModalOpen: true
    });
  };

  handleOnEdit = ({ id, directions, ingredients, title, published }) => {
    this.setState({
      form: {
        directions,
        ingredients,
        title,
        published
      },
      modalOpen: true,
      isEditing: true,
      recipeId: id
    });
  };

  handleCloseModal = () => {
    this.setState({
      viewModalOpen: false,
      isEditing: false,
      addModalOpen: false
    });
  };

  updateRecipe = ({
    id,
    directions,
    ingredients,
    title,
    published,
    action
  }) => {
    const { updateRecipeMutation } = this.props;
    updateRecipeMutation({
      variables: {
        id,
        directions,
        title,
        ingredients,
        published
      },
      refetchQueries: [
        {
          query: GetAllPublishedRecipes
        }
      ]
    })
      .then(res => {
        if (res.data.updateRecipe.id) {
          this.setState(
            () => ({
              isEditing: false
            }),
            () =>
              this.setState(
                () => ({
                  notification: {
                    notificationOpen: true,
                    type: 'success',
                    message: `recipe ${title} ${action} successfully`,
                    title: 'Success'
                  }
                }),
                () => this.handleResetState()
              )
          );
        }
      })
      .catch(e => {
        this.setState(prevState => ({
          notification: {
            ...prevState.notification,
            notificationOpen: true,
            type: 'error',
            message: e.message,
            title: 'Error Occured'
          }
        }));
      });
  };

  handleOnDelete = ({ id, directions, ingredients, title }) => {
    this.updateRecipe({
      id,
      directions,
      ingredients,
      title,
      published: false,
      action: 'deleted'
    });
  };

  handleSubmit = () => {
    const {
      form: { directions, ingredients, title, published }
    } = this.state;
    const { recipeId, isEditing } = this.state;

    if (isEditing) {
      this.updateRecipe({
        id: recipeId,
        directions,
        ingredients,
        title,
        published,
        action: 'edited'
      });
    } else {
      const { addNewRecipeMutation } = this.props;
      addNewRecipeMutation({
        variables: {
          directions,
          title,
          ingredients,
          published
        },
        refetchQueries: [
          {
            query: GetAllPublishedRecipes
          }
        ]
      })
        .then(res => {
          if (res.data.createRecipe.id) {
            this.setState(
              () => ({
                addModalOpen: false
              }),
              () =>
                this.setState(
                  () => ({
                    notification: {
                      notificationOpen: true,
                      type: 'success',
                      message: `recipe ${title} added successfully`,
                      title: 'Success'
                    }
                  }),
                  () => this.handleResetState()
                )
            );
          }
        })
        .catch(e => {
          this.setState(prevState => ({
            notification: {
              ...prevState.notification,
              notificationOpen: true,
              type: 'error',
              message: e.message,
              title: 'Error Occured'
            }
          }));
        });
    }
  };

  renderNotification = () => {
    const {
      notification: { notificationOpen, type, title, message }
    } = this.state;

    if (notificationOpen) {
      notification[type]({
        message: title,
        description: message
      });
    }
  };

  render() {
    const {
      viewModalOpen,
      recipeData,
      isEditing,
      addModalOpen,
      form
    } = this.state;
    const {
      data: { loading, recipes }
    } = this.props;

    return (
      <Fragment>
        <ViewRecipeModal
          handleCloseModal={this.handleCloseModal}
          modalOpen={viewModalOpen}
          recipe={recipeData}
        />

        <div>
          {loading && (
            <div className="spin-container">
              <Spin />
            </div>
          )}
          {recipes && recipes.length > 0 ? (
            <Row gutter={16}>
              {recipes.map(recipe => (
                <Col lg={6} key={recipe.id}>
                  <RecipeCard
                    title={recipe.title}
                    content={(
                      <Fragment>
                        <Card
                          type="inner"
                          title="Ingredients"
                          style={{ marginBottom: '15px' }}
                        >
                          {`${recipe.ingredients.substring(0, 50)}.....`}
                        </Card>
                        <Card type="inner" title="Directions">
                          {`${recipe.directions.substring(0, 50)}.....`}
                        </Card>
                      </Fragment>
)}
                    handleOnClick={this.handleOnClick}
                    handleOnEdit={this.handleOnEdit}
                    handleOnDelete={this.handleOnDelete}
                    {...recipe}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty />
          )}
          <AddRecipeModal
            modalOpen={addModalOpen || isEditing}
            handleCloseModal={this.handleCloseModal}
            handleSubmit={this.handleSubmit}
            handleChecked={this.handleChecked}
            handleChange={this.handleChange}
            {...form}
          />
          <div className="fab-container">
            <Button
              type="primary"
              shape="circle"
              icon="plus"
              size="large"
              onClick={this.handleOpenAddModal}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

AllRecipesContainer.propTypes = {
  client: PropTypes.shape({}).isRequired,
  addNewRecipeMutation: PropTypes.func.isRequired,
  updateRecipeMutation: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    recipes: PropTypes.arrayOf(PropTypes.shape({}))
  })
};

export default compose(
  graphql(UpdateRecipe, { name: 'updateRecipeMutation' }),
  graphql(AddNewRecipe, { name: 'addNewRecipeMutation' }),
  graphql(GetAllPublishedRecipes)
)(withApollo(AllRecipesContainer));
