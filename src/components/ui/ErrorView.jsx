import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="mx-auto text-red-500" 
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;