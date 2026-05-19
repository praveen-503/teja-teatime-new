import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, ShoppingCart, Bell } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function BottomNav() {
  const location = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const menuActive = location.pathname.startsWith('/menu') || location.pathname.startsWith('/product');

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-3">
        {/* Menu (Home) */}
        <NavItem
          to="/menu"
          label="Menu"
          icon={Home}
          active={menuActive && !location.pathname.startsWith('/menu/')}
        />

        {/* Categories */}
        <NavItem
          to="/menu"
          label="Browse"
          icon={LayoutGrid}
          active={location.pathname.startsWith('/menu/')}
        />

        {/* Cart */}
        <div className="relative">
          <NavItem
            to="/cart"
            label="Cart"
            icon={ShoppingCart}
            active={isActive('/cart')}
          />
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-amber-tea text-white text-[10px] font-bold font-poppins h-5 w-5 flex items-center justify-center rounded-full shadow-primary"
            >
              {totalItems > 9 ? '9+' : totalItems}
            </motion.span>
          )}
        </div>

        {/* Waiter */}
        <NavItem
          to="/waiter"
          label="Waiter"
          icon={Bell}
          active={isActive('/waiter')}
        />
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}

function NavItem({ to, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link to={to} className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
      <motion.div
        animate={{
          color: active ? '#D98E04' : '#9B7653',
          scale: active ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Icon
          size={22}
          strokeWidth={active ? 2.5 : 1.5}
        />
        {active && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-tea rounded-full"
          />
        )}
      </motion.div>
      <span
        className="text-[10px] font-medium font-inter"
        style={{ color: active ? '#D98E04' : '#9B7653' }}
      >
        {label}
      </span>
    </Link>
  );
}
