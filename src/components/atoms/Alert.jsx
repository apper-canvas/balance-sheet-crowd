import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Alert = ({ 
  variant = "info", 
  icon, 
  title, 
  description, 
  className 
}) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "success":
        return "border-green-200 bg-green-50 text-green-800";
      default:
        return "border-blue-200 bg-blue-50 text-blue-800";
    }
  };

  const getIconColor = (variant) => {
    switch (variant) {
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "success":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className={cn(
      "rounded-lg border p-4",
      getVariantClasses(variant),
      className
    )}>
      <div className="flex items-start space-x-3">
        {icon && (
          <ApperIcon 
            name={icon} 
            size={20} 
            className={getIconColor(variant)} 
          />
        )}
        <div>
          {title && (
            <h4 className="text-sm font-medium mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;