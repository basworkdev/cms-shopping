import React ,{useState,useEffect} from "react";
import DataTable from 'react-data-table-component';
import ProductsApi from '../../apis/ProductsApi'
import { useHistory } from "react-router-dom";
import tc from '../../config/text.json'


export default function AllProductsPage(props) {
  const tcv = tc.validate.requestFiles;
  let history = useHistory();
  const [dataProductsState , setDataProductState] = useState([])

  useEffect(()=>{
    getProducts();
  },[])

  const editProduct = (id) => {
    history.push(`product/edit/${id}`)
  }

  const deleteProduct = async (id,img) => {
    let confirmX = window.confirm("ยืนยันการลบสินค้า รหัส " + id);
    let imgList = img.split(",")
    imgList = imgList.map((data,index)=>{
      let name = data.split("/");
      return name[4];
    })
    if(confirmX === true) {
      let data = {
        id : id,
        img : imgList
      }
      let res = await ProductsApi.doserviceDeleteProduct(data);
      if(res.code === 1) {
        getProducts();
        alert(res.message);
      } else {
        alert(tcv.error);
      }
    }
  }
    
  const getProducts = async () => {
    let products = await ProductsApi.doserviceGetAllProduct();
    let productsData = products.map((data,index)=>{
      return {
        id : data.id,
        productKey : data.productKey,
        name : data.name,
        price : data.price,
        fullPrice : data.fullPrice,
        productKey : data.productKey,
        type : data.typeName,
        brand  : data.brand,
        stock : data.stock,
        status : data.status,
        img : data.img,
        mainImg : data.mainImg
      }
    })
    setDataProductState(productsData);
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
    {
      name: 'รหัส',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'คีย์',
      selector: 'productKey',
      sortable: true,
    },
    {
      name: 'ชื่อ',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'ประเภท',
      selector: 'type',
      sortable: true,
    },
    {
        name: 'แบรนด์',
        selector: 'brand',
        sortable: true,
    },
    {
        name: 'ราคา',
        selector: 'price',
        sortable: true,
    },
    {
      name: 'ราคาหลัก',
      selector: 'fullPrice',
      sortable: true,
    },
    {
        name: 'สต็อก',
        selector: 'stock',
        sortable: true,
    },
    {
      cell: (data) => <>
        <font style={{fontSize : "1.2rem" , cursor : "pointer"}} className="text-warning" onClick={()=>editProduct(data.id)}><i className="fas fa-edit"></i></font> &nbsp;&nbsp;&nbsp;
        <font style={{fontSize : "1.2rem" , cursor : "pointer"}} className="text-danger" onClick={()=>deleteProduct(data.id,(data.img+","+data.mainImg))}><i className="fas fa-minus-circle"></i></font>
      </>
    }
  ];
  
  const BasicTable = () => {
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    console.log(dataProductsState.filter(item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase())))
    const filteredItems = dataProductsState.filter(item => 
        item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        // item.id && item.id.toLowerCase().includes(filterText.toLowerCase()) ||
        item.brand && item.brand.toLowerCase().includes(filterText.toLowerCase()) ||
        item.type && item.type.toLowerCase().includes(filterText.toLowerCase())
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
  
    return (
      <DataTable
        // title="Contact List"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        persistTableHead
      />
    );
  };
return(
    <>
        <div className="container admin-page">
            <h2>สินค้าทั้งหมด <span><button className="btn btn-primary" onClick={()=>{history.push('/product/create/product')}}>เพิ่มสินค้า</button></span></h2>
            <br/>
            
            <div>
                <BasicTable/>
            </div>
        </div>
    </>
  )
}