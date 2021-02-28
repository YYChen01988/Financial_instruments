import React from 'react';
import App from './App';
import { AgGridReact } from 'ag-grid-react';
import { mount } from 'enzyme';
import color from'./color.js';


const testData = [
  {
    "ticker": "OMEGA",
    "price": 2306.35,
    "assetClass": "Equities"
  }, 
  {
    "ticker": "Beta",
    "price": -1849.83,
    "assetClass": "Macro"
  }];

const setRowData = (wrapper, rowData) => {
  return new Promise(function (resolve, reject) {
    wrapper.setState({ rowData }, () => {
      wrapper.update();
      resolve();
    });
  })
}

const ensureGridApiHasBeenSet = (wrapper) => {
  return new Promise(function (resolve, reject) {
    (function waitForGridReady() {
      if (wrapper.instance().gridApi) {
        resolve(wrapper);
        return;
      }
      setTimeout(waitForGridReady, 100);
    })();
  });

};

describe('Grid Actions Panel', () => {
  let wrapper = null;
  let agGridReact = null;

  beforeEach((done) => {
    wrapper = mount(<App />);

    agGridReact = wrapper.find(AgGridReact).instance();

    ensureGridApiHasBeenSet(wrapper)
      .then(() => setRowData(wrapper, testData))
      .then(() => done());
  });

  afterEach(() => {
    wrapper.unmount();
    wrapper = null;
    agGridReact = null;
  })

  it('renders without crashing', () => {
    expect(wrapper.find('.ag-theme-balham').exists()).toBeTruthy();
  });

  it('renders test rows', () => {
    // 1) Querying JSDOM
    // if you want to query the grid you'll need to use wrapper.render().find();
    // https://github.com/enzymejs/enzyme/issues/1233
    const gridRows = wrapper.render().find('.ag-center-cols-container .ag-row');
    const columns = wrapper.render().find('.ag-header-cell');
    for (let i = 0; i < gridRows.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        const colId = gridRows[i].children[j].attribs['col-id'];
        const cellText = gridRows[i].children[j].children[0].data;
        const testValue = testData[i][colId].toString();
        expect(cellText).toEqual(testValue);
      }
    }
    // 2) Using ag-Grid's API
    agGridReact.api.forEachNode((node, nodeInd) => {
      Object.keys(node.data).forEach(colId => {
        const cellValue = node.data[colId];
        const testValue = testData[nodeInd][colId];
        expect(cellValue).toEqual(testValue);
      })
    });
  });

  it('CSS styling in cells as expected', () => {
    const cells = wrapper.render().find('.ag-cell-value');
    // assert Ticker
    expect(cells[0].parent.attribs.style.includes('background: '+color.blue)).toBeTruthy()
    // expect(cells[3].children[0].parent.attribs.style).toBe(3)

  });

  it('Positive pricing text is blue', () => {
    const cells = wrapper.render().find('.ag-cell-value');
    // assert Price positive value
    expect(cells[0].children[0].parent.next.attribs.style.includes('color: '+color.textBlue)).toBeTruthy()

  });

  it('Negative pricing text is red', () => {
    const cells = wrapper.render().find('.ag-cell-value');
    // assert Price positive value
    expect(cells[3].children[0].parent.attribs.style.includes('color: '+color.textRed)).toBeTruthy()

  });

})