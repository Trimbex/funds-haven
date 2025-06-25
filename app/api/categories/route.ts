import { NextResponse } from 'next/server';
import { getCategories,addCategory,editCategory,deleteCategory, updateCategorySpending } from '@/app/server/categories/categories';


export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
  
    if (!userId) {
      return NextResponse.json({ success: false, message: 'user_id is required' }, { status: 400 });
    }
  
    try {
      const result = await getCategories(userId);
      if (result.success) {
        return NextResponse.json({ success: true, categories: result.categories });
      } else {
        return NextResponse.json({ success: false, message: result.message }, { status: 500 });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
    }
  }

export async function POST(request: Request) {
    try {
        const { user_id, category_name, category_description, tags, budget, spent, color, predefined, image, icon, recurring } = await request.json();

        if (!user_id || !category_name) {
            return NextResponse.json({ success: false, message: 'user_id and category_name are required' }, { status: 400 });
        }

        const result = await addCategory(user_id, category_name, category_description, tags, budget, spent, color, predefined, image, icon, recurring);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error adding category:", error);
        return NextResponse.json({ success: false, message: 'Failed to add category' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { category_id, category_name, category_description, tags, budget, spent, color, predefined, image, icon, recurring } = await request.json();

        if (!category_id || !category_name) {
            return NextResponse.json({ success: false, message: 'category_id and category_name are required' }, { status: 400 });
        }

        const result = await editCategory(category_id, category_name, category_description, tags, budget, spent, color, predefined, image, icon, recurring);
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

export async function PATCH(request: Request) {
    try {
        const { user_id, action } = await request.json();

        if (!user_id) {
            return NextResponse.json({ success: false, message: 'user_id is required' }, { status: 400 });
        }

        if (action === 'update_spending') {
            // Get all categories for the user
            const categoriesResult = await getCategories(user_id);
            if (categoriesResult.success && categoriesResult.categories) {
                const categoryIds = categoriesResult.categories.map(cat => cat.category_id);
                const result = await updateCategorySpending(user_id, categoryIds);
                return NextResponse.json(result);
            } else {
                return NextResponse.json({ success: false, message: 'Failed to get categories' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error("Error updating category spending:", error);
        return NextResponse.json({ success: false, message: 'Failed to update category spending' }, { status: 500 });
    }
}

