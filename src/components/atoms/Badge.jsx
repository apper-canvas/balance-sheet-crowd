import { cn } from "@/utils/cn";

const Badge = ({ 
  variant = "default", 
  className, 
  children 
}) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-700";
      case "error":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      case "secondary":
        return "bg-gray-100 text-gray-700";
      case "income":
        return "bg-green-100 text-green-700";
      case "expense":
        return "bg-red-100 text-red-700";
      default:
        return "bg-primary-100 text-primary-700";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      getVariantClasses(variant),
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;