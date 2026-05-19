import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import WelcomePage from '@/pages/WelcomePage';
import CategoriesPage from '@/pages/CategoriesPage';
import ProductListPage from '@/pages/ProductListPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import TrackingPage from '@/pages/TrackingPage';
import WaiterPage from '@/pages/WaiterPage';

function App() {
  return (
    <BrowserRouter>
      <div className="mobile-shell">
        <Routes>
          {/* Welcome — no bottom nav */}
          <Route path="/table/:id" element={<WelcomePage />} />

          {/* App pages — with bottom nav */}
          <Route element={<AppLayout />}>
            <Route path="/menu" element={<CategoriesPage />} />
            <Route path="/menu/:categoryId" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/tracking/:id" element={<TrackingPage />} />
            <Route path="/waiter" element={<WaiterPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/table/1" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
