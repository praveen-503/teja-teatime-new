import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      {icon && (
        <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mb-6 text-brown-300">
          {icon}
        </div>
      )}
      <h3 className="font-poppins font-semibold text-xl text-charcoal mb-2">{title}</h3>
      {description && (
        <p className="font-inter text-sm text-brown-300 leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  );
}
