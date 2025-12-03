import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <ApperIcon 
          name="Loader2" 
          size={48} 
          className="mx-auto animate-spin text-primary-600" 
        />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loading;