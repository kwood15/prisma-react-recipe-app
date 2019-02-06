import React from 'react';
import PropTypes from 'prop-types';
import { Card, Modal } from 'antd';

const ViewRecipeModal = ({ modalOpen, recipe, handleCloseModal }) => (
  <Modal
    title={recipe.title}
    centered
    visible={modalOpen}
    onOk={handleCloseModal}
    onCancel={handleCloseModal}
  >
    <Card type="inner" title="Ingredients" style={{ marginBottom: '15px' }}>
      {recipe.ingredients}
    </Card>
    <Card type="inner" title="Directions">
      {recipe.directions}
    </Card>
  </Modal>
);

ViewRecipeModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  recipe: PropTypes.shape({
    ingredients: PropTypes.string,
    directions: PropTypes.string
  }).isRequired
};

export default ViewRecipeModal;
