import { supabase } from './client';

export async function uploadCategoryImage(
  userId: string, 
  file: File
): Promise<string | null> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('CategoryImages')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('CategoryImages')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadCategoryImage:', error);
    return null;
  }
}