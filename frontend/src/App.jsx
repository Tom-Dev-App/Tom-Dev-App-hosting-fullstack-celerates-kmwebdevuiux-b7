import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import UploadProduct from "./pages/UploadProduct/UploadProduct";
import { ProtectedRoute, PublicRoute } from "./context/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import CategoryCRUD from "./pages/Category/Category";
import SignIn from "./pages/Auth/Signin";
import SignUp from "./pages/Auth/Signup";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/Unauthorized" element={<Unauthorized />}></Route>
          
          <Route element={<ProtectedRoute requiredRoles={'admin'} />}>
          <Route path="/products/new" element={<UploadProduct />} />
          </Route>
          <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
            <Route path="/categories" element={<CategoryCRUD />}></Route>
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
