import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Package", 
  title = "No data found", 
  message, 
  actionText, 
  onAction,
  action
}) => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center space-y-4 max-w-md">
        <ApperIcon 
          name={icon} 
          size={48} 
          className="mx-auto text-gray-400" 
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {message && <p className="text-gray-600">{message}</p>}
        </div>
        {(onAction || action) && (
          <Button onClick={onAction || action?.onClick}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText || action?.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;