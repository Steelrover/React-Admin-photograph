import React, { Component } from 'react';
import { REDUX_FORM_NAME, withDataProvider, TextInput, required } from 'react-admin';
import { translate } from 'ra-core';
import { Field, change } from 'redux-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';
import { shallowEqual } from 'recompose';
import compose from 'recompose/compose';
import sanitizeRestProps from './sanitizeRestProps';

import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const grid = '0.5rem';

const styles = {
  list: {
      display: 'flex',
      listStyleType: 'none',
  },
  image: {
      margin: '0.5rem',
      maxHeight: '10rem',
  },
  root: {
    marginTop: '24px',
    padding: '6px 24px',
    display: 'flex',
    flexWrap: 'wrap',
    position: 'fixed',
    bottom: 0,
    zIndex: 1400,
    alignItems: 'center',
    backgroundColor: 'rgb(49, 49, 49)',
    color: '#fff',
    // justifyContent: 'center',
    transform: 'translate(0px, 0px)',
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    '@media (min-width: 960px)': {
        minWidth: '288px',
        maxWidth: '568px',
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
    },
    '@media (max-width: 959.95px)': {
        width: '100%',
        borderRadius: 0,
        left: 0,
        right: 0,
    },
    '@media (max-width: 600px)': {
        bottom: '80px',
    }
  },
  rootHidden: {
    transform: 'translate(-50%, 50px)',
    '@media (max-width: 599px)': {
      transform: 'translate(0px, 130px)',
    }
  },
  p: {
    color: '#fff',
    padding: '8px 0'
  },
  /*button: {
    color: 'rgb(219, 88, 88)',
  },*/
  action: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingLeft: '24px',
    marginRight: '-8px',
    '@media (max-width: 959.95px)': {
        marginRight: '48px',
    }
  },
};

//Styled components
const Title = styled.span`
  font-size: 0.75rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 1;
  color: rgba(0, 0, 0, 0.54);
`
const ItemListField = styled.div`
  min-height: 3rem;
  display: flex;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'lightgray' : 'white'}
`
const ItemContainer = styled.div`
  position: relative;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDragging
      ? 'gray'
      : 'white'};
` 

// ------------

const ImgStyle = {
  maxHeight: '10rem',
  margin: grid
}

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayRemoveIcon: false,
    }
  }

  toggleRemoveIcon = () => {
    this.setState({
      displayRemoveIcon: !this.state.displayRemoveIcon,
    })
  }

  render() {
    return (
      <Draggable 
        key={this.props.item.id} 
        draggableId={this.props.item.id} 
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <ItemContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
            onMouseOver={this.toggleRemoveIcon}
            onMouseOut={this.toggleRemoveIcon}
          >
            <IconButton
                style={{position: 'absolute', 
                        top: 8, right: 8, 
                        display:`${this.state.displayRemoveIcon ? 'block' : 'none'}`}}
                className={this.props.classes.removeButton}
                onClick={(e) => this.props.onRemove(e, this.props.item.id)}
                title={this.props.translate('ra.action.delete')}
             >
                <RemoveCircle className={this.props.classes.removeIcon} />
             </IconButton>
            <img src={this.props.item.url} id={this.props.item.id} style={ImgStyle}/>
          </ItemContainer>
        )}
      </Draggable>
    )
  }
}


class ItemList extends Component {
  render() {
    return (
      <div>
        <Title>{this.props.list.title}</Title>
        <Droppable droppableId={this.props.list.id} direction={this.props.direction} >
          {(provided, snapshot) => (
            <ItemListField
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
              
            >
              {this.props.items.map((item, index) => (
                <Item key={item.id} item={item} index={index} 
                      classes={this.props.classes} 
                      onRemove={this.props.onRemove} 
                      translate={this.props.translate} />
              ))}
              {provided.placeholder}
            </ItemListField>
          )}
        </Droppable>
      </div>
    )
  }
}

const FieldComponent = () => {
  return (
    <TextInput validation={this.fieldValidation} />
  )
}

class ImageFieldDragList extends Component {
    constructor(props) {
      super(props);
      this.cancelBlockTimeout = {};
      this.executeTimeout = {};
      this.tempState = {};
      this.state = {
        items: this.props.record['pictures'],
        lists: {
          'public': {
            id: 'public',
            title: 'Общедоступные изображения',
            itemIds: this.props.record['publicOrder']
          },
          'private': {
            id: 'private',
            title: 'Доступные по подписке',
            itemIds: this.props.record['privateOrder']
          }
        },
        // Facilitate reordering of the lists
        listOrder: ['public', 'private'],
        displayCancelButton: true,
        displayCancelBlock: false,
      };
    }

    onDragEnd = (result) => {
      const { destination, source, draggableId } = result;
      const { dataProvider, dispatch, record } = this.props;

      // Moving out from list
      if (!destination) {
        return
      }

      // Moving to the same place
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return
      }

      const start = this.state.lists['' + source.droppableId]
      const finish = this.state.lists['' + destination.droppableId]

      // Moving within one list
      if (start === finish) {
        const newItemIds = Array.from(start.itemIds)
        newItemIds.splice(source.index, 1)
        newItemIds.splice(destination.index, 0, draggableId)

        const newList = {
          ...start,
          itemIds: newItemIds
        }

        const newState = {
          ...this.state,
          lists: {
            ...this.state.lists,
            [newList.id]: newList
          }
        }

        this.setState(newState, () => { 
                                        dispatch(change(REDUX_FORM_NAME, 
                                                        'publicOrder', 
                                                        newState.lists.public.itemIds));
                                        dispatch(change(REDUX_FORM_NAME, 
                                                        'privateOrder', 
                                                        newState.lists.private.itemIds)) 
                                      });
        return
      }

      // Moving from one list to another
      const startItemIds = Array.from(start.itemIds)
      startItemIds.splice(source.index, 1)
      const newStart = {
        ...start,
        itemIds: startItemIds
      }

      const finishItemIds = Array.from(finish.itemIds)
      finishItemIds.splice(destination.index, 0, draggableId)
      const newFinish = {
        ...finish,
        itemIds: finishItemIds
      }

      const newState = {
        ...this.state,
        lists: {
          ...this.state.lists,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      };

      this.setState(newState, () => {  
                                      dispatch(change(REDUX_FORM_NAME, 
                                                      'publicOrder', 
                                                      newState.lists.public.itemIds));
                                      dispatch(change(REDUX_FORM_NAME, 
                                                      'privateOrder', 
                                                      newState.lists.private.itemIds)); 
                                    })
    }

    showCancelBlock = () => {
      clearTimeout(this.cancelBlockTimeout);
      this.setState({ ...this.state,
        displayCancelButton: true,
        displayCancelBlock: true,
      }, () => {
        this.cancelBlockTimeout = setTimeout(() => { 
          this.setState({ displayCancelBlock: false })
        }, 5000);
      })
    }

    onCancelClick = () => {
        this.setState({ ...this.state,
            displayCancelButton: false
        }, () => {
          clearTimeout(this.executeTimeout);
          clearTimeout(this.cancelBlockTimeout);
          this.setState({ ...this.state,
            items: this.tempState.items,
            lists: this.tempState.lists,
          });
          this.cancelBlockTimeout = setTimeout(() => { 
            this.setState({ displayCancelBlock: false })
          }, 5000);
        });
    }

    onRemove = (e, itemId) => {
        this.tempState = { 
          items: Object.assign({}, this.state.items), 
          lists: Object.assign({}, this.state.lists),
        };
        const filteredFiles = Object.assign({}, this.state.items);
        delete filteredFiles[itemId];

        const { dataProvider, dispatch, record } = this.props;

        let publicItems = this.state.lists.public.itemIds,
            privateItems = this.state.lists.private.itemIds;

        publicItems = publicItems.filter(id => (id !== itemId));
        privateItems = privateItems.filter(id => (id !== itemId));

        let newState = { ...this.state,
                        items: filteredFiles,
                        lists: {
                          'public': {
                            ...this.state.lists.public,
                            itemIds: publicItems
                          },
                          'private': {
                            ...this.state.lists.private,
                            itemIds: privateItems
                          }
                        }
                      };
        this.setState(newState, () => {  
                                  this.showCancelBlock();
                                  this.executeTimeout = setTimeout(() => {
                                    dispatch(change(REDUX_FORM_NAME, 
                                                    'publicOrder', 
                                                    newState.lists.public.itemIds));
                                    dispatch(change(REDUX_FORM_NAME, 
                                                    'privateOrder', 
                                                    newState.lists.private.itemIds));
                                  }, 7000);
                                   
                                });
        

    };

    render() {
        let { className, classes, record, source, title, ...rest } = this.props;
        const sourceValue = get(record, source);
 
        if (!sourceValue) {
            return <div className={className} {...sanitizeRestProps(rest)} />;
        }

        return(
          <div>
            <TextInput source="publicOrder" style={{ opacity: '0.5', display: 'none'}} /> {/* style={{ display: 'none'}} */}
            <TextInput source="privateOrder" style={{ opacity: '0.5', display: 'none'}} />
            <DragDropContext onDragEnd={this.onDragEnd}>
              <div>
                {this.state.listOrder.map(listId => {
                  const list = this.state.lists[listId] //|| { itemIds: []}; // Fix crash if item list is empty
                  const items = list.itemIds.map(
                    itemId => this.state.items[itemId]
                  )

                  return (
                    <ItemList 
                      key={listId} 
                      list={list} 
                      items={items} 
                      direction='horizontal' 
                      classes={classes}
                      title={list.title}
                      onRemove={this.onRemove}
                      translate={this.props.translate}
                    />
                  )
                 })
                }
              </div>
              <Paper className={`${classes.root} ${this.state.displayCancelBlock ? '' : classes.rootHidden}`} >
                <Typography component="p" className={classes.p}>
                  {`${this.state.displayCancelButton ? 'Элемент удален' : 'Операция отменена'}`}
                </Typography>
                {this.state.displayCancelButton
                 ?  <div className={classes.action}>
                        <Button size="small" 
                                color='primary'
                                // className={classes.button} 
                                onClick={this.onCancelClick}>
                            ОТМЕНИТЬ
                        </Button>
                    </div>
                 : <div/>}
              </Paper>

            </DragDropContext>
          </div>
        )
    };
}

ImageFieldDragList.displayName = 'ImageField';

ImageFieldDragList.propTypes = {
    title: PropTypes.string
}

const EnhancedImageField = withStyles(styles)(ImageFieldDragList);

EnhancedImageField.defaultProps = {
    addLabel: true,
};


EnhancedImageField.displayName = 'EnhancedImageField';

export default compose(
    translate
)(withDataProvider(EnhancedImageField));

