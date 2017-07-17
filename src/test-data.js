var React = require('react');
var BananaElement = (<div>Banana<div className='custom-option-tag'><span>Yummy</span></div></div>);

module.exports = {
  fruits: [{ value: 'Apple', label: 'Apple', color: ['Red', 'Green', 'Yellow'], growsOn: 'Tree', size: 'big'},
       { value: 'Banana', label: 'Banana', labelComponent: BananaElement, color: 'Yellow', growsOn: 'Tree', toolTipContent: 'Loaded with potassium', toolTipTitle: 'BANANAS', size: 'big'},
       { value: 'Coconut', label: 'Coconut', color: 'Brown', growsOn: 'Tree', size: 'big'},
       { value: 'Durian', label: 'Durian', color: 'Green', growsOn: 'Tree', size: 'big'},
       { value: 'Elderberry', label: 'Elderberry', color: 'Purple', growsOn: 'Tree', size: 'big'},
       { value: 'Fig', label: 'Fig', color: 'Purple', growsOn: 'Tree', size: 'big'},
       { value: 'Grape', label: 'Grape', color: ['Purple', 'Green', 'Red'], growsOn: 'Vine', size: 'small'},
       { value: 'Huckleberry', label: 'Huckleberry', color: 'Blue', growsOn: 'Bush', size: 'medium'},
       { value: 'Ita Palm', label: 'Ita Palm', color: 'Brown', growsOn: 'Tree', size: 'big'},
       { value: 'Jujubes', label: 'Jujubes', color: 'Brown', growsOn: 'Tree', size: 'big'},
       { value: 'Kiwi', label: 'Kiwi', color: 'Green', growsOn: 'Tree', size: 'big'},
       { value: 'Lemon', label: 'Lemon', color: 'Yellow', growsOn: 'Tree', size: 'big'},
       { value: 'Mango', label: 'Mango', color: 'Orange', growsOn: 'Tree', size: 'big'},
       { value: 'Nectarine', label: 'Nectarine', color: 'Pink', growsOn: 'Tree', size: 'big'},
       { value: 'Orange', label: 'Orange', color: 'Orange', growsOn: 'Tree', size: 'big'},
       { value: 'Pineapple', label: 'Pineapple', color: 'Yellow', growsOn: 'Tree', size: 'big'},
       { value: 'Quince', label: 'Quince', color: 'Yellow', growsOn: 'Tree', size: 'big'},
       { value: 'Raspberry', label: 'Raspberry', color: 'Red', growsOn: 'Bush', size: 'medium'},
       { value: 'Strawberry', label: 'Strawberry', color: 'Red', growsOn: 'Vine', size: 'small'},
       { value: 'Tangerine', label: 'Tangerine', color: 'Orange', growsOn: 'Tree', size: 'big'},
       { value: 'Ugli', label: 'Ugli', color: 'Green', growsOn: 'Tree', size: 'big'},
       { value: 'Voavanga', label: 'Voavanga', color: 'Brown', growsOn: 'Tree', size: 'big'},
       { value: 'Watermelon', label: 'Watermelon', color: 'Green', growsOn: 'Vine', size: 'small'},
       { value: 'Xigua Melon', label: 'Xigua Melon', color: 'Yellow', growsOn: 'Vine', size: 'small'},
       { value: 'Yellow Watermelon', label: 'Yellow Watermelon', color: 'Green', growsOn: 'Vine', size: 'small'},
       { value: 'Zucchini', label: 'Zucchini', color: 'Green', growsOn: 'Vine', size: 'big'}]
};
