import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  rightElement,
  transparent = false,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 pt-10 pb-4 ${
        transparent ? 'bg-transparent' : 'bg-cream-100 sticky top-0 z-30'
      }`}
    >
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-2xl shadow-card text-charcoal hover:shadow-card-hover transition-shadow shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h1 className="font-poppins font-semibold text-xl text-charcoal truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-brown-300 font-inter">{subtitle}</p>
        )}
      </div>

      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </motion.header>
  );
}
