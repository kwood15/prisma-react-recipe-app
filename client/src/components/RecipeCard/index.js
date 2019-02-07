import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Card, Icon, Button } from 'antd';

const RecipeCard = ({
  title,
  content,
  id,
  handleOnClick,
  handleOnEdit,
  handleOnDelete,
  directions,
  ingredients,
  published
}) => {
  const [isLoading, setLoadingStatus] = useState(true);

  useEffect(() => {
    setLoadingStatus(false);
  });

  return (
    <Card
      loading={isLoading}
      title={title}
      bordered={false}
      extra={(
        <Fragment>
          <Button
            onClick={() =>
              handleOnEdit({ id, directions, ingredients, title, published })
            }
          >
            <Icon
              style={{
                fontSize: '1.25rem',
                color: '#08c',
                marginRight: '0.625rem'
              }}
              type="edit"
            />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this recipe?"
            onConfirm={() =>
              handleOnDelete({
                id,
                directions,
                ingredients,
                title
              })
            }
            okText="Yes"
            cancelText="No"
          >
            <span className="pointer">
              <Icon
                style={{
                  fontSize: '1.25rem',
                  color: '#08c',
                  marginRight: '0.625rem'
                }}
                type="delete"
              />
            </span>
          </Popconfirm>
          <span className="pointer">
            <Icon
              style={{
                fontSize: '1.25rem',
                color: '#08c'
              }}
              type="eye"
              onClick={() => handleOnClick(id)}
            />
          </span>
        </Fragment>
)}
      style={{
        marginBottom: '50px'
      }}
    >
      {content}
    </Card>
  );
};

RecipeCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.shape({}),
  published: PropTypes.bool.isRequired,
  directions: PropTypes.string.isRequired,
  ingredients: PropTypes.string.isRequired,
  handleOnEdit: PropTypes.func.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  handleOnDelete: PropTypes.func.isRequired
};

export default RecipeCard;
