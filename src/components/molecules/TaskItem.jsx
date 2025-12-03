import { cn } from '@/utils/cn';
import { formatShortDate } from '@/utils/formatters';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

function TaskItem({ task, onEdit, onDelete, className }) {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'open':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.due_date_c && new Date(task.due_date_c) < new Date() && task.status_c !== 'Completed';

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200",
      isOverdue && "border-red-200 bg-red-50",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {task.title_c || task.Name}
          </h3>
          {task.description_c && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {task.description_c}
            </p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge className={getStatusColor(task.status_c)}>
          {task.status_c}
        </Badge>
        <Badge className={getPriorityColor(task.priority_c)}>
          <ApperIcon 
            name={task.priority_c === 'High' ? 'ArrowUp' : task.priority_c === 'Low' ? 'ArrowDown' : 'Minus'} 
            size={12} 
            className="mr-1"
          />
          {task.priority_c}
        </Badge>
        {task.category_c && (
          <Badge variant="secondary">
            <ApperIcon name="Tag" size={12} className="mr-1" />
            {task.category_c}
          </Badge>
        )}
      </div>

      {task.due_date_c && (
        <div className={cn(
          "flex items-center text-sm",
          isOverdue ? "text-red-600" : "text-gray-500"
        )}>
          <ApperIcon 
            name={isOverdue ? "AlertCircle" : "Calendar"} 
            size={14} 
            className="mr-1"
          />
          {isOverdue ? "Overdue: " : "Due: "}
          {formatShortDate(task.due_date_c)}
        </div>
      )}
    </div>
  );
}

export default TaskItem;