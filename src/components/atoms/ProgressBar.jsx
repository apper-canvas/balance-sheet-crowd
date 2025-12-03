import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = "default", 
  className = "" 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-primary-500";
    }
  };

  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <div 
        className={cn(
          "h-full rounded-full transition-all duration-300",
          getVariantClasses(variant)
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;