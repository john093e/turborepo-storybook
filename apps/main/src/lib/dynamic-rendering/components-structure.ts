import { ComponentList, IComponent } from './dynamic-rendering.interfaces';

import Card from './components-structure/card';
import Button from './components-structure/button';
import Divider from './components-structure/divider';
import Container from './components-structure/container';
import Input from './components-structure/input';

interface IComponentStructure {
    component: string;
    props: {
      [key: string]: any;
    }
  }
  
const componentsStructure: { [key in ComponentList]: IComponentStructure } = {
    Card,
    Button,
    Divider,
    Container,
    Input
}
export default componentsStructure;
