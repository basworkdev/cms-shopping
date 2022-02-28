import React , {useState , useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useHistory
} from "react-router-dom";
// CSS
import './assets/bootstrap-4.5.3/css/bootstrap-grid.css'
import './assets/bootstrap-4.5.3/css/bootstrap-reboot.css'
import './assets/bootstrap-4.5.3/css/bootstrap.css'
import './assets/css/main.css'
import './assets/css/main-admin.css'
import './assets/fontawesome-free-5.15.1-web/css/all.css';
import './assets/css/spinner.css'

// JS
import $ from "jquery"
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Admin Page
import LoginAdminPage from './page/LoginPage'
import DashboardPage from './page/DashboardPage'


// Admin Components
import AdminMenuTopComp from './component/MenuTopComp'
import AllProductsPage from './page/products/AllProductsPage'
import CreateProductPage from './page/products/CreateProductPage'
import OrderTable from "./page/order/OrderTable";
import OrderDetailPage from "./page/order/OrderDetailPage";



export default function Main(props) {
    const [subUrlState , setSubUrlState] = useState([""]);
    
    useEffect(()=>{
        let url = window.location
        console.log(url.pathname.split("/"))
        setSubUrlState(url.pathname.split("/"));
    },[])

    return (
        <div>
            <Router>
                {localStorage.getItem("user")
                ? 
                <><AdminMenuTopComp/></>
                // <></>
                : 
                <></>}

                <Switch>
                    <Route path="/login">
                        <LoginAdminPage/>
                    </Route>
                    <Route path="/dashboard">
                        <DashboardPage/>
                    </Route>
                    <Route path="/all-product">
                        <AllProductsPage/>
                    </Route>
                    <Route path="/product/:event/:id">
                        <CreateProductPage/>
                    </Route>
                    <Route path="/all-order">
                        <OrderTable/>
                    </Route>
                    <Route path="/order-detail/:orderId">
                        <OrderDetailPage/>
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}