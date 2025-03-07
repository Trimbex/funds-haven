import { NextResponse } from 'next/server';
import { getCategories,addCategory,editCategory,deleteCategory } from '@/app/server/categories/categories';


export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
  
    if (!userId) {
      return NextResponse.json({ success: false, message: 'user_id is required' }, { status: 400 });
    }
  
    try {
      const categories = await getCategories(userId);
      return NextResponse.json({ success: true, categories });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return NextResponse.json({ success: false, message: 'Failed to fetch accounts' }, { status: 500 });
    }
  }

export async function POST(request: Request) {
    try {
        const { user_id, category_name, category_description, tags, budget, spent, color, predefined, image, recurring } = await request.json();

        if (!user_id || !category_name) {
            return NextResponse.json({ success: false, message: 'user_id and category_name are required' }, { status: 400 });
        }

        const result = await addCategory(user_id, category_name, category_description, tags, budget, spent, color, predefined, image, recurring);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error adding category:", error);
        return NextResponse.json({ success: false, message: 'Failed to add category' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { category_id, category_name, category_description, tags, budget, spent, color, predefined, image, recurring } = await request.json();

        if (!category_id || !category_name) {
            return NextResponse.json({ success: false, message: 'category_id and category_name are required' }, { status: 400 });
        }

        const result = await editCategory(category_id, category_name, category_description, tags, budget, spent, color, predefined, image, recurring);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { category_id } = await request.json();

        if (!category_id) {
            return NextResponse.json({ success: false, message: 'category_id is required' }, { status: 400 });
        }

        const result = await deleteCategory(category_id);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
    }
}

