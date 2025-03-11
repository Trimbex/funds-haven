import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Upload } from 'lucide-react';
import { Category, PRESET_COLORS, PRESET_IMAGES, CATEGORY_ICONS } from '../category-form';
import { getCurrentUserID } from '@/app/api/general';
import { toast } from 'sonner';
import { uploadCategoryImage } from '@/app/utils/supabase/storage';

interface CategoryAppearanceTabProps {
  formData: Omit<Category, 'category_id'> & { category_id?: string };
  setFormData: React.Dispatch<React.SetStateAction<Omit<Category, 'category_id'> & { category_id?: string }>>;
}

export default function CategoryAppearanceTab({ formData, setFormData }: CategoryAppearanceTabProps) {
  const [iconSearch, setIconSearch] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input
  const [isUploading, setIsUploading] = useState(false);
  const [user,setUser] =  useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await getCurrentUserID();
//         if (response.success) {
//           setUser(response.userId);
//         }
//       } catch (error) {
//         console.error('Failed to fetch user ID:', error);
//       }
//     };
//     fetchUser();
//   })


  

  // Filter icons based on search term
  const filteredIcons = CATEGORY_ICONS.filter(icon => 
    icon.name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconName: string) => {
    setFormData(prev => ({ ...prev, icon: iconName }));
  };

  const handlePresetImageSelect = (imagePath: string) => {
    setFormData(prev => ({ ...prev, image: imagePath }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if (!file || !user) return;

    // setIsUploading(true);
    // try {
    //   const imageUrl = await uploadCategoryImage(user.id, file);
    //   if (imageUrl) {
    //     setFormData(prev => ({ ...prev, image: imageUrl }));
    //     toast.success('Image uploaded successfully');
    //   } else {
    //     toast.error('Failed to upload image');
    //   }
    // } catch (error) {
    //   toast.error('Error uploading image');
    //   console.error('Upload error:', error);
    // } finally {
    //   setIsUploading(false);
    //   setFileInputKey(Date.now());
    // }



    if (file) {
      // In a real implementation, you would upload this file to your server or a storage service
      // For now, we'll create a temporary URL for preview purposes
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      
      // Reset the file input to allow selecting the same file again
      setFileInputKey(Date.now());
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Top row: Icon and Color selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Icon selection section */}
        <div className="space-y-3">
          <Label htmlFor="icon-search" className="text-base font-medium">Category Icon</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="icon-search"
              placeholder="Search icons..."
              className="pl-8 w-full"
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md p-4 h-64 overflow-y-auto bg-white">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredIcons.map((icon) => {
                  const IconComponent = icon.component;
                  return (
                    <div
                      key={icon.name}
                      onClick={() => handleIconSelect(icon.name)}
                      className={`
                        p-2 flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer
                        ${formData.icon === icon.name ? 'bg-primary/10 border-2 border-primary' : 'hover:bg-gray-100 border border-transparent'}
                      `}
                    >
                      <div className="p-2 flex items-center justify-center">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="text-xs text-center font-medium truncate w-full">{icon.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">No icons found with that name</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Color picker UI */}
        <div className="space-y-3">
          <Label htmlFor="color" className="text-base font-medium">Category Color</Label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {PRESET_COLORS.map((colorOption) => (
              <div 
                key={colorOption.value}
                onClick={() => setFormData(prev => ({ ...prev, color: colorOption.value }))}
                className={`
                  relative cursor-pointer rounded-md overflow-hidden border-2 h-12
                  ${formData.color === colorOption.value ? 'border-gray-800' : 'border-gray-200'}
                `}
              >
                <div 
                  className="w-full h-full flex items-center justify-center" 
                  style={{ backgroundColor: colorOption.value }}
                >
                  <span className="text-xs font-medium" style={{
                    color: ['#ca8a04', '#16a34a', '#0d9488', '#06b6d4'].includes(colorOption.value) ? 'black' : 'white',
                    textShadow: '0px 0px 2px rgba(0,0,0,0.2)'
                  }}>
                    {colorOption.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <Input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              className="w-12 h-10 p-1 cursor-pointer border border-gray-300"
            />
            <span className="text-sm font-medium">Custom color: {formData.color}</span>
          </div>
        </div>
      </div>
      
      {/* Bottom row: Image selection */}
      <div className="w-full space-y-3">
        <Label className="text-base font-medium">Category Image</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {PRESET_IMAGES.map((img) => (
            <div 
              key={img.path} 
              onClick={() => handlePresetImageSelect(img.path)}
              className={`
                flex flex-col cursor-pointer rounded-md overflow-hidden
                ${formData.image === img.path ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}
              `}
            >
              <div className="h-32 bg-gray-100 border border-gray-200 rounded-t-md relative overflow-hidden">
                {/* Replace this with actual image rendering */}
                <img 
                  src={img.path} 
                  alt={img.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Fallback display if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-gray-400">[Image Preview]</span>
                      </div>
                    `;
                  }}
                />
              </div>
              <div className={`
                p-2 text-center border border-t-0 border-gray-200 rounded-b-md
                ${formData.image === img.path ? 'bg-blue-50' : 'bg-white'}
              `}>
                <span className="text-sm font-medium">{img.name}</span>
              </div>
            </div>
          ))}
          
          {/* Custom image upload preview */}
          { false && formData.image.startsWith('blob:') && (
            <div 
              className="flex flex-col cursor-pointer rounded-md overflow-hidden ring-2 ring-blue-500"
            >
              <div className="h-32 bg-gray-100 border border-gray-200 rounded-t-md relative overflow-hidden">
                <img 
                  src={formData.image} 
                  alt="Custom upload"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-2 text-center border border-t-0 border-gray-200 rounded-b-md bg-blue-50">
                <span className="text-sm font-medium">Custom Upload</span>
              </div>
            </div>
          )}
        </div>
        
{  false &&    <div className="mt-4 flex items-center gap-2">
        <Input
        key={fileInputKey}
        id="custom-image"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        />
        <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('custom-image')?.click()}
        className="flex items-center gap-2"
        >
        <Upload className="h-4 w-4" /> Upload Custom Image
        </Button>
        
        <span className="text-sm text-gray-500">
        {formData.image.startsWith('blob:') ? 'Custom image selected' : 'Select an image or upload your own'}
        </span>
    </div>}
      </div>
    </div>
  );
}