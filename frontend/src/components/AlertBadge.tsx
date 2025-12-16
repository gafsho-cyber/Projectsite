
interface AlertBadgeProps {
  severity: 'critical' | 'warning' | 'info';
}

export function AlertBadge({ severity }: AlertBadgeProps) {
  const badgeStyles = {
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
}
