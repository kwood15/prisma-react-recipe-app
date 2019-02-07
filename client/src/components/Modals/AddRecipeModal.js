import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Switch } from 'antd';

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 14
  }
};

const AddRecipeModal = ({
  modalOpen,
  title,
  ingredients = '',
  directions,
  handleChecked,
  handleChange,
  handleSubmit,
  handleClose,
  published,
  ...props
}) => (
  <Modal
    title="Add new recipe"
    centered
    visible={modalOpen}
    onOk={handleSubmit}
    onCancel={handleClose}
    {...props}
  >
    <Form layout="horizontal">
      <Form.Item label="Title" {...formItemLayout}>
        <Input
          value={title}
          onChange={handleChange}
          placeholder="recipe title"
          name="title"
        />
      </Form.Item>
      <Form.Item label="Ingredients" {...formItemLayout}>
        <Input.TextArea
          value={ingredients}
          onChange={handleChange}
          name="ingredients"
          placeholder="recipe ingredients"
        />
      </Form.Item>
      <Form.Item label="Directions" {...formItemLayout}>
        <Input.TextArea
          value={directions}
          onChange={handleChange}
          placeholder="recipe directions"
          name="directions"
        />
      </Form.Item>
      <Form.Item label="Published" {...formItemLayout}>
        <Switch checked={published} onChange={handleChecked} />
      </Form.Item>
    </Form>
  </Modal>
);

AddRecipeModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.string.isRequired,
  directions: PropTypes.string.isRequired,
  handleChecked: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  published: PropTypes.bool.isRequired
};

const WrappedForm = Form.create({ name: 'add-new-recipe' })(AddRecipeModal);

export default WrappedForm;
