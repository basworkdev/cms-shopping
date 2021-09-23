import React ,{useState,useEffect} from "react";
import DataTable from 'react-data-table-component';
import { useHistory } from "react-router-dom";
import tc from '../../config/text.json'

// Apis
import OrderApi from '../../apis/OrderApi'


export default function OrderTable(props) {
  const tcv = tc.validate.requestFiles;
  let history = useHistory();
  let moment = require('moment');
  let numeral = require('numeral');
  const [dataState , setDataState] = useState([])

  useEffect(()=>{
    getData();
  },[])
    
  const getData = async () => {
    let resp = await OrderApi.doserviceGetOrderAll();
    setDataState(resp);
  }
    
  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
    <div className="row">
        <div className="col-10">
            <input id="search" className="form-control" type="text" placeholder="Search" aria-label="Search Input" value={filterText} onChange={onFilter} />
        </div>
        <div className="col-2">
            <button type="button" className="btn btn-outline-dark" onClick={onClear}>X</button>
        </div>
    </div>
    </>
  );
    
  const columns = [
    // {
    //   cell: (data) => {
    //     return <button type="button" class="btn btn-primary btn-sm"><i class="fas fa-file"></i></button>
    //   },
    //   width : "50px"
      
    // },
    {
      name: 'รหัส',
      selector: 'id',
      sortable: true,
      width : "150px"
    },
    {
      name: 'ชื่อ',
      selector: 'customer_name',
      sortable: true,
    },
    {
      name: 'อีเมล',
      selector: 'customer_email',
      sortable: true,
    },
    {
      name: 'จำนวน',
      selector: 'amount',
      sortable: true,
    },
    {
      name: 'ราคา',
      selector: 'sum_price',
      sortable: true,
      cell: (data) => {
        let value = "-"
        if(data) {
          value = numeral(data.sum_price).format('0,0')
        }
        return value;
      }
    },
    {
      name: 'สถานะ',
      selector: 'status',
      sortable: true,
    },
    {
      name: 'วันที่สั่งซื้อ',
      selector: 'order_time',
      sortable: true,
      cell: (data) => {
        return moment(data.order_time).format("YYYY/MM/DD")
      }
    },
    {
      name: 'วันที่อัพเดต',
      selector: 'order_time_update',
      sortable: true,
      cell: (data) => {
        return moment(data.order_time_update).format("YYYY/MM/DD")
      }
    }
  ];
  
  const BasicTable = () => {
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    // console.log(dataState.filter(item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase())))
    const filteredItems = dataState.filter(item => 
        item.id && item.id.toLowerCase().includes(filterText.toLowerCase()) ||
        item.customer_name && item.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.customer_email && item.customer_email.toLowerCase().includes(filterText.toLowerCase()) ||
        item.status && item.status.toLowerCase().includes(filterText.toLowerCase())
        );
  
    const subHeaderComponentMemo = React.useMemo(() => {
      const handleClear = () => {
        if (filterText) {
          setResetPaginationToggle(!resetPaginationToggle);
          setFilterText('');
        }
      };
  
      return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
    }, [filterText, resetPaginationToggle]);
  
    const rowClick = (e) => {
      window.open( `/order-detail/${e.id}`, '_blank');
      
    }
    return (
      <div style={{cursor : "pointer"}}>
        <DataTable
          noHeader
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          // selectableRows
          persistTableHead
          onRowClicked={(e)=>rowClick(e)}
        />
      </div>
    );
  };
return(
    <>
        <div className="container admin-page">
            <h2>ออเดอร์ทั้งหมด</h2>
            <br/>
            <div>
                <BasicTable/>
            </div>
        </div>
    </>
  )
}