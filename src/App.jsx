import './App.css';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import Catalog from './components/Catalog';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from './components/Login'
import Logout from './components/Logout'
import { StateProvider } from './StateProvider'
import ProductForm from './components/ProductForm';
import NotFound from './components/NotFound'
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import ViewUser from './components/ViewUser';
import EditUser from './components/EditUser';
import CreateUser from './components/CreateUser';
import './i18n';

const queryClient  = new QueryClient();

function App() {
  return (
    <StateProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationBar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            {/* Product paths */}
            <Route path='/catalog/:category' element={<Catalog />} />
            <Route path='/catalog' element={<Catalog />} />
            <Route path='/add-product' element={<ProductForm />}/>
            <Route path='/edit-product/:id' element={<ProductForm />}/>
            <Route path='/view-product/:id' element={<ProductPage />}/>
            <Route path='/cart' element={<Cart />}/>
            {/* User paths */}
            <Route path='/login' element={<Login />}/>
            <Route path='/logout' element={<Logout />}/>
            <Route path='/sign-up' element={<CreateUser />}/>
            <Route path='/view-user' element={<ViewUser />}/>
            <Route path='/edit-user' element={<EditUser />}/>
            {/* Wildcard */}
            <Route path='*' element={<NotFound />} />
          </Routes>
      </QueryClientProvider>
    </StateProvider>
  );
}

export default App;

