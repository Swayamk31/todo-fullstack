import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';

interface TaskCardProps {
  id: string;
  text: string;
  completed: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function TaskCard({
  id,
  text,
  completed,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="flex items-center gap-3">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className="flex-1"
            autoFocus
          />
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleCancel}
            size="sm"
            variant="outline"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggleComplete(id)}
            id={`task-${id}`}
          />
          <label
            htmlFor={`task-${id}`}
            className={`flex-1 cursor-pointer transition-all ${
              completed
                ? 'line-through text-gray-400'
                : 'text-gray-800'
            }`}
          >
            {text}
          </label>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="ghost"
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(id)}
              size="sm"
              variant="ghost"
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
