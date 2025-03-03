// src/app/categories/page.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, Edit, Trash2, Search, X, PieChart, 
  TrendingUp, DollarSign, Filter, ChevronDown 
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Groceries", description: "Food and household items", transactionCount: 42, amount: 1246.50, color: "#34D399" },
    { id: "2", name: "Utilities", description: "Electricity, water, internet", transactionCount: 12, amount: 528.75, color: "#60A5FA" },
    { id: "3", name: "Entertainment", description: "Movies, games, subscriptions", transactionCount: 18, amount: 312.28, color: "#F472B6" },
    { id: "4", name: "Transportation", description: "Gas, public transit, car maintenance", transactionCount: 26, amount: 486.12, color: "#FBBF24" },
    { id: "5", name: "Dining Out", description: "Restaurants and cafes", transactionCount: 31, amount: 842.33, color: "#F87171" },
    { id: "6", name: "Healthcare", description: "Doctor visits, medicine, insurance", transactionCount: 8, amount: 526.90, color: "#818CF8" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === "amount" || sortBy === "transactionCount") {
      return sortOrder === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    }
    return sortOrder === "asc" 
      ? a[sortBy].localeCompare(b[sortBy]) 
      : b[sortBy].localeCompare(a[sortBy]);
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryData = {
      id: editingCategory ? editingCategory.id : String(categories.length + 1),
      name: formData.get("name"),
      description: formData.get("description"),
      color: formData.get("color"),
      transactionCount: editingCategory ? editingCategory.transactionCount : 0,
      amount: editingCategory ? editingCategory.amount : 0
    };

    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? categoryData : cat));
    } else {
      setCategories([...categories, categoryData]);
    }
    setIsModalOpen(false);
  };

  // Card hover animation
  const cardHoverAnimation = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }
  };

  // Calculate totals for summary
  const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalTransactions = categories.reduce((sum, cat) => sum + cat.transactionCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-gray-500">Manage your spending categories and track expenses</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl shadow p-6 flex items-center"
            initial="rest"
            whileHover="hover"
            variants={cardHoverAnimation}
          >
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow p-6 flex items-center"
            initial="rest"
            whileHover="hover"
            variants={cardHoverAnimation}
          >
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow p-6 flex items-center"
            initial="rest"
            whileHover="hover"
            variants={cardHoverAnimation}
          >
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
            </div>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-40">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="transactionCount">Transactions</option>
                <option value="amount">Amount</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCategory}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Category
            </motion.button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="h-2" style={{ backgroundColor: category.color }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Transactions</p>
                      <p className="text-lg font-medium text-gray-900">{category.transactionCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-lg font-medium text-gray-900">${category.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-gray-600">
                            {((category.amount / totalAmount) * 100).toFixed(1)}% of total
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ 
                            width: `${(category.amount / totalAmount) * 100}%`,
                            backgroundColor: category.color
                          }} 
                          className="rounded shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mx-auto h-12 w-12 text-gray-400">
              <PieChart className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search terms." : "Get started by creating a new category."}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleAddCategory}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Category
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Category Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      defaultValue={editingCategory?.name || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Groceries"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={2}
                      defaultValue={editingCategory?.description || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Short description of the category"
                    />
                  </div>
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <input
                      type="color"
                      name="color"
                      id="color"
                      defaultValue={editingCategory?.color || "#3B82F6"}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingCategory ? "Update" : "Create"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}