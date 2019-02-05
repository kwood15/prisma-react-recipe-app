import React, { Component, Fragment } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import {
  Layout,
  Card,
  Col,
  Row,
  Empty,
  Spin,
  Button,
  notification
} from 'antd';

// components
import ViewRecipeModal from '../../components/modals/ViewRecipeModal';
import AddRecipeModal from '../../components/modals/AddRecipeModal';
import RecipeCard from '../../components/RecipeCard';

// queries
import GetAllPublishedRecipes from '../../graphql/queries/GetAllPublishedRecipes';
import GetSingleRecipe from '../../graphql/queries/GetSingleRecipe';

// mutations
import UpdateRecipe from '../../graphql/mutations/UpdateRecipe';
import AddNewRecipe from '../../graphql/mutations/AddNewRecipe';

const { Sider } = Layout;

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

  handleResetState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    event.persist();

    this.setState((prevState, nextProps) => ({
      form: { ...prevState.form, [event.target.name]: event.target.value }
    }));
  };

  handleChecked = checked => {
    this.setState((prevState, nextProps) => ({
      form: { ...prevState.form, published: checked }
    }));
  };

  handleOnClick = recipeId => {
    this.props.client
      .query({
        query: GetSingleRecipe,
        variables: {
          recipeId
        }
      })
      .then(res => {
        this.setState((prevState, nextProps) => ({
          viewModalOpen: true,
          recipeData: res.data.recipe
        }));
      });
  };

  handleOpenAddModal = () => {
    this.setState((prevState, nextProps) => ({
      addModalOpen: true
    }));
  };

  handleOnEdit = ({ id, directions, ingredients, title, published }) => {
    this.setState((prevState, nextProps) => ({
      form: {
        directions,
        ingredients,
        title,
        published
      },
      modalOpen: true,
      isEditing: true,
      recipeId: id
    }));
  };

  handleCloseModal = () => {
    this.setState((prevState, nextProps) => ({
      viewModalOpen: false,
      isEditing: false,
      addModalOpen: false
    }));
  };

  _updateRecipe = ({
    id,
    directions,
    ingredients,
    title,
    published,
    action
  }) => {
    this.props
      .updateRecipeMutation({
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
            (prevState, nextProps) => ({
              isEditing: false
            }),
            () =>
              this.setState(
                (prevState, nextProps) => ({
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
        this.setState((prevState, nextProps) => ({
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
    this._updateRecipe({
      id,
      directions,
      ingredients,
      title,
      published: false,
      action: 'deleted'
    });
  };

  handleSubmit = event => {
    const { directions, ingredients, title, published } = this.state.form;
    const { recipeId, isEditing } = this.state;

    if (isEditing) {
      this._updateRecipe({
        id: recipeId,
        directions,
        ingredients,
        title,
        published,
        action: 'edited'
      });
    } else {
      this.props
        .addNewRecipeMutation({
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
              (prevState, nextProps) => ({
                addModalOpen: false
              }),
              () =>
                this.setState(
                  (prevState, nextProps) => ({
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
          this.setState((prevState, nextProps) => ({
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
    const { notificationOpen, type, title, message } = this.state.notification;

    if (notificationOpen) {
      notification[type]({
        message: title,
        description: message
      });
    }
  };

  render() {
    const { loading, recipes } = this.props.data;
    const { viewModalOpen, recipeData, isEditing, addModalOpen } = this.state;

    return (
      <Fragment>
        <ViewRecipeModal
          handleCloseModal={this.handleCloseModal}
          modalOpen={viewModalOpen}
          recipe={recipeData}
        />

        <Sider>
          {loading ? (
            <div className="spin-container">
              <Spin />
            </div>
          ) : recipes.length > 0 ? (
            <Row gutter={16}>
              {recipes.map(recipe => (
                <Col span={6} key={recipe.id}>
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
            {...this.state.form}
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
          {this.renderNotification()}
        </Sider>
      </Fragment>
    );
  }
}

export default compose(
  graphql(UpdateRecipe, { name: 'updateRecipeMutation' }),
  graphql(AddNewRecipe, { name: 'addNewRecipeMutation' }),
  graphql(GetAllPublishedRecipes)
)(withApollo(AllRecipesContainer));
