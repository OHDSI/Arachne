/*
  *
  * Copyright 2018 Odysseus Data Services, inc.
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  * Company: Odysseus Data Services, Inc.
  * Product Owner/Architecture: Gregory Klebanov
  * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
  * Created: Tuesday, March 20, 2018 5:15 PM
  *
  */

import { Component, PropTypes } from 'react';
import presenter from './presenter';

const rowHeight = 35;

export default class VirtualTable extends Component {
  static get propTypes() {
    return {
      list: PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);
    const rowsCount = props.data.length + 1; // plus header line
    this.state = {
      container: null,
      containerHeight: rowsCount * rowHeight
    };
    this.setContainer = this.setContainer.bind(this);
  }

  setContainer(container) {
    if (container) {
      const rect = container.getBoundingClientRect();

      let containerHeight = rect.height;
      if (this.props.list === true) {
        containerHeight += rowHeight; // compensate forcibly hidden header
      }

      if (rect.height === 0 || this.state.containerHeight === containerHeight) {
        return false;
      } else {
        this.setState({
          container,
          containerHeight,
        });
      }
    }
  }

  getAdpativeColumns() {
    const { columns = [] } = this.props;
    return columns.map(col => {
      const { name = '' } = col;
      const c = document.createElement('canvas').getContext('2d');
      c.font = '14px Montserrat';
      const mt = c.measureText(String(name).toUpperCase());
      return {
        ...col,
        width: mt.width + 32,
      };
    });
  }

  render() {
    const props = {
      ...this.props,
      ...this.state,
      setContainer: this.setContainer,
    };
    if (this.props.adaptiveColumns === true) {
      props.columns = this.getAdpativeColumns();
    }
    return presenter(props);
  }
}
