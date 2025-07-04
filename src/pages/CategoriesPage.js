import React, { useState, useEffect } from 'react';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    setCategories(storedCategories);
  }, []);

  const saveCategories = (updatedCategories) => {
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      showAlert('Category name is required', 'danger');
      return;
    }
    
    // Check if category name already exists
    const categoryExists = categories.some(
      cat => cat.name.toLowerCase() === newCategory.name.toLowerCase() && 
             (editingId === null || cat.id !== editingId)
    );
    
    if (categoryExists) {
      showAlert('A category with this name already exists', 'danger');
      return;
    }
    
    let updatedCategories;
    
    if (editingId === null) {
      // Add new category
      const newCategoryWithId = {
        ...newCategory,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      updatedCategories = [...categories, newCategoryWithId];
      showAlert('Category added successfully');
    } else {
      // Update existing category
      updatedCategories = categories.map(cat => 
        cat.id === editingId ? { ...cat, ...newCategory, updatedAt: new Date().toISOString() } : cat
      );
      
      setEditingId(null);
      showAlert('Category updated successfully');
    }
    
    saveCategories(updatedCategories);
    setNewCategory({ name: '', description: '' });
  };

  const handleEdit = (category) => {
    setNewCategory({ name: category.name, description: category.description });
    setEditingId(category.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // Check if any products are using this category
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const categoryInUse = products.some(product => product.categoryId === id);
      
      if (categoryInUse) {
        showAlert('Cannot delete category because it is being used by products', 'danger');
        return;
      }
      
      const updatedCategories = categories.filter(cat => cat.id !== id);
      saveCategories(updatedCategories);
      showAlert('Category deleted successfully');
      
      // Reset form if we were editing the deleted category
      if (editingId === id) {
        setEditingId(null);
        setNewCategory({ name: '', description: '' });
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div className="categories-page">
      <h1>Manage Categories</h1>
      
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
      
      <div className="card">
        <h2 className="card-title">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingId ? 'Update Category' : 'Add Category'}
            </button>
            
            {editingId && (
              <button type="button" className="btn" onClick={cancelEdit} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="card">
        <h2 className="card-title">Categories List</h2>
        
        {categories.length === 0 ? (
          <p>No categories found. Add your first category above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn" 
                      onClick={() => handleEdit(category)}
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;