import logo from './logo.svg';
import './App.css';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import rowData from './sampleData.json'
import color from './color.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headName: 'Ticker', field: 'ticker' },
        {
          headName: 'Price', field: 'price',
          cellStyle: params => {
            if (params.value > 0) {
              return { color: color.textBlue };
            } else {
              return { color: color.textRed }
            }
            return null;
          }
        },
        { headName: 'Asset Class', field: 'assetClass' },
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
      },
      rowData: null,

    };
  }
  getRowStyle = params => {
    if (params.data.assetClass === 'Macro') {
      return { background: color.white };
    }
    else if (params.data.assetClass === 'Credit') {
      return { background: color.green };
    } else if (params.data.assetClass === 'Equities') {
      return { background: color.blue };
    }
  };

  componentDidMount() {
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    // API CALL GOES HERE
    this.setState({ rowData })

  };

  render() {
    return (
      <div>
        <header>For multiple columns sort, please hold shift and click headers</header>
        <div
          className="ag-theme-balham"
          style={{
            width: 800,
            height: 600,
          }}
        >
          <AgGridReact getRowStyle={this.getRowStyle}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            defaultColDef={this.state.defaultColDef}
            onGridReady={this.onGridReady}
          />

          {/* <Table/> */}
        </div>
      </div>
    )
  }
}

export default App;
