import React, {Component} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {ImageField} from 'react-admin';
import './SortableComponent.css';

const SortableItem = SortableElement(({value}) =>
  <ImageField source={["pictures", "0", "url"]} src="url" className="SortableItem">{value}</ImageField>
);

const SortableList = SortableContainer(({items, helperClass}) => {
  return (
    <div className={`SortableList ${helperClass ? helperClass : ''}`}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

class SortableComponent extends Component {
  state = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} helperClass="SortableHelper" axis='x'/>;
  }
}

export default SortableComponent
