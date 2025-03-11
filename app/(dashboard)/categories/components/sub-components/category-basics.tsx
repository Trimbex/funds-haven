import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Category, PRESET_TAGS} from '../category-form';
import { CATEGORY_ICONS } from '../category-form';

interface CategoryBasicsTabProps {
  formData: Omit<Category, 'category_id'> & { category_id?: string };
  setFormData: React.Dispatch<React.SetStateAction<Omit<Category, 'category_id'> & { category_id?: string }>>;
}

export default function CategoryBasicsTab({ formData, setFormData }: CategoryBasicsTabProps) {
  const [tagInput, setTagInput] = useState('');

  // Find the selected icon component
  const SelectedIcon = CATEGORY_ICONS.find(icon => icon.name === formData.icon)?.component || CATEGORY_ICONS[0].component;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    // Only add the tag if it doesn't already exist
    if (!formData.tags.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: {
          tags: [...prev.tags.tags, tag]
        }
      }));
    }
    setTagInput('');
  };

  const handlePresetTagClick = (tag: string) => {
    addTag(tag);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: {
        tags: prev.tags.tags.filter(tag => tag !== tagToRemove)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category_name">Category Name</Label>
            <Input
              id="category_name"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              required
              placeholder="e.g., Groceries, Rent, Entertainment"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category_description">Description</Label>
            <Textarea
              id="category_description"
              name="category_description"
              value={formData.category_description}
              onChange={handleChange}
              placeholder="Short description of this category..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Amount</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={handleNumberChange}
                required
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spent">Amount Spent</Label>
              <Input
                id="spent"
                name="spent"
                type="number"
                min="0"
                step="0.01"
                value={formData.spent}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="recurring">Recurring</Label>
            <Switch
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => handleSwitchChange('recurring', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50 h-48">
            <div className="text-center">
              <SelectedIcon className="mx-auto mb-2" size={48} color={formData.color} />
              <div className="text-sm font-medium">Selected Icon</div>
              <div className="text-xs text-gray-500">
                Change icon in the Appearance tab
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-lg">
              <div 
                className="flex items-center gap-2 p-2 rounded-md" 
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <div
                  className="p-2 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  <SelectedIcon size={20} color="white" />
                </div>
                <div>
                  <div className="font-medium">{formData.category_name || "Category Name"}</div>
                  <div className="text-xs text-gray-500">
                    Budget: ${formData.budget}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags section - with preset tags and custom input */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_TAGS.map((tag) => (
            <Badge 
              key={tag}
              variant={formData.tags.tags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePresetTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a custom tag..."
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={() => tagInput.trim() && addTag(tagInput.trim())}
            variant="secondary"
            size="sm"
          >
            Add
          </Button>
        </div>
        
        {formData.tags.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Label className="w-full text-sm text-gray-500">Selected Tags:</Label>
            {formData.tags.tags.map((tag, index) => (
              <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-1"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}