import { useState } from 'react';
import { 
  Plus, 
  X, 
  Smile, 
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { CATEGORIES_LIST } from '../../data/mockData';
import { Category, TransactionType } from '../../types';

export default function CategoriesPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES_LIST);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form State
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    emoji: '',
    type: 'expense' as TransactionType
  });

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSave = () => {
    if (!catForm.name || !catForm.emoji) return;
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? {
          ...c,
          name: catForm.name,
          description: catForm.description,
          emoji: catForm.emoji,
          type: catForm.type
        } : c
      ));
    } else {
      const cat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: catForm.name,
        description: catForm.description,
        emoji: catForm.emoji,
        type: catForm.type
      };
      setCategories([...categories, cat]);
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setCatForm({ name: '', description: '', emoji: '', type: 'expense' });
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      description: cat.description || '',
      emoji: cat.emoji,
      type: cat.type
    });
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      setSelectedCategory(null);
    }
  };

  const CategoryBox = ({ category, ...props }: { category: Category, [key: string]: any }) => (
    <button
      {...props}
      onClick={() => setSelectedCategory(category)}
      className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/50"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-2xl dark:bg-zinc-900">
          {category.emoji}
        </div>
        <div className="text-left">
          <p className="font-bold text-zinc-900 dark:text-white">{category.name}</p>
          <p className="text-xs text-zinc-500 line-clamp-1">{category.description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-zinc-300 transition-transform group-hover:translate-x-1" />
    </button>
  );

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Categories
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Organize your finances with custom categories.
        </p>
      </header>

      {/* Income Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-bold">Income Categories</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {incomeCategories.map(c => (
            <CategoryBox key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Expense Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-rose-600">
          <TrendingDown className="h-5 w-5" />
          <h2 className="text-xl font-bold">Expense Categories</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expenseCategories.map(c => (
            <CategoryBox key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 md:bottom-8 md:right-8 transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
                  {(['income', 'expense'] as TransactionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setCatForm({ ...catForm, type })}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                        catForm.type === type
                          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                      )}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel, Bonus"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Emoji Icon</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste emoji here"
                      value={catForm.emoji}
                      onChange={(e) => setCatForm({ ...catForm, emoji: e.target.value })}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    />
                    <div className="flex aspect-square h-11 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                      {catForm.emoji || <Smile className="h-5 w-5 text-zinc-400" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Description</label>
                  <textarea
                    placeholder="Brief description..."
                    rows={3}
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={closeForm}
                    className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                  >
                    {editingCategory ? 'Save Changes' : 'Save Category'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl dark:bg-zinc-950"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-50 text-5xl mx-auto dark:bg-zinc-900">
                {selectedCategory.emoji}
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedCategory.name}</h3>
              <p className={cn(
                "mt-1 text-sm font-bold uppercase tracking-wider",
                selectedCategory.type === 'income' ? "text-emerald-600" : "text-rose-600"
              )}>
                {selectedCategory.type} Category
              </p>
              <div className="mt-6 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {selectedCategory.description || "No description provided for this category."}
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(selectedCategory)}
                    className="flex-1 rounded-2xl border border-zinc-200 py-3 font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCategory.id)}
                    className="flex-1 rounded-2xl border border-rose-200 py-3 font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('transactions');
                    setSelectedCategory(null);
                  }}
                  className="w-full rounded-2xl bg-zinc-900 py-3 font-bold text-white hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  View Transactions
                </button>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full rounded-2xl border border-zinc-200 py-3 font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
