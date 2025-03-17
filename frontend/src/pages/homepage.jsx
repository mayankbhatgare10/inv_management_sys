import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Edit, Trash2, X } from 'lucide-react';
import './homepage.css';

// Sample initial products
const initialProducts = [
  { id: 1, name: 'Laptop', category: 'Electronics', quantity: 10, price: 999.99 },
  { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 15, price: 199.99 },
  { id: 3, name: 'Wireless Mouse', category: 'Electronics', quantity: 30, price: 29.99 },
  { id: 4, name: 'Coffee Maker', category: 'Appliances', quantity: 8, price: 79.99 },
  { id: 5, name: 'Bookshelf', category: 'Furniture', quantity: 5, price: 149.99 },
];

// Sample categories
const categories = ['Electronics', 'Furniture', 'Appliances', 'Office Supplies', 'Other'];

function Homepage({ addNotification }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    // Load products from localStorage or use initial data
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      quantity: Number(newProduct.quantity),
      price: Number(newProduct.price)
    };

    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    setShowAddModal(false);
    setNewProduct({ name: '', category: '', quantity: 0, price: 0 });
    
    // Add notification
    addNotification(`Added new product: ${productToAdd.name}`, 'success');
  };

  const handleEditProduct = () => {
    if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0) {
      return;
    }

    const updatedProducts = products.map(product => 
      product.id === currentProduct.id ? {
        ...currentProduct,
        quantity: Number(currentProduct.quantity),
        price: Number(currentProduct.price)
      } : product
    );

    setProducts(updatedProducts);
    setShowEditModal(false);
    
    // Add notification
    addNotification(`Updated product: ${currentProduct.name}`, 'info');
  };

  const handleDeleteProduct = (id) => {
    const productToDelete = products.find(product => product.id === id);
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    
    // Add notification
    addNotification(`Deleted product: ${productToDelete.name}`, 'error');
  };

  const openEditModal = (product) => {
    setCurrentProduct({ ...product });
    setShowEditModal(true);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const applySort = (option) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const resetFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = !filters.category || product.category === filters.category;
    
    // Price filter
    const matchesMinPrice = !filters.minPrice || product.price >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.price <= Number(filters.maxPrice);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'name-a-z':
        return a.name.localeCompare(b.name);
      case 'name-z-a':
        return b.name.localeCompare(a.name);
      case 'quantity-low-high':
        return a.quantity - b.quantity;
      case 'quantity-high-low':
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });

  return (
    <div className="homepage">
      <div className="toolbar">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="toolbar-actions">
          <button className="action-button" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>
          
          <button className="action-button" onClick={() => setShowFilterModal(true)}>
            <Filter size={18} />
            <span>Filter</span>
          </button>
          
          <button className="action-button" onClick={() => setShowSortModal(true)}>
            <ArrowUpDown size={18} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.category || filters.minPrice || filters.maxPrice) && (
        <div className="active-filters">
          <span>Active filters:</span>
          {filters.category && (
            <div className="filter-tag">
              Category: {filters.category}
            </div>
          )}
          {filters.minPrice && (
            <div className="filter-tag">
              Min Price: ₹{filters.minPrice}
            </div>
          )}
          {filters.maxPrice && (
            <div className="filter-tag">
              Max Price: ₹{filters.maxPrice}
            </div>
          )}
          <button className="reset-filters" onClick={resetFilters}>
            Reset
          </button>
        </div>
      )}

      {/* Products table */}
      <div className="products-container">
        {sortedProducts.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="edit-button" 
                        onClick={() => openEditModal(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeleteProduct(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleAddProduct}>Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-name">Product Name</label>
                <input
                  type="text"
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-quantity">Quantity</label>
                <input
                  type="number"
                  id="edit-quantity"
                  min="0"
                  value={currentProduct.quantity}
                  onChange={(e) => setCurrentProduct({...currentProduct, quantity: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-price">Price (₹)</label>
                <input
                  type="number"
                  id="edit-price"
                  min="0"
                  step="0.01"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleEditProduct}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Filter Products</h2>
              <button className="close-button" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="filter-category">Category</label>
                <select
                  id="filter-category"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="min-price">Min Price (₹)</label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  step="0.01"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="max-price">Max Price (₹)</label>
                <input
                  type="number"
                  id="max-price"
                  min="0"
                  step="0.01"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowFilterModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Sort Products</h2>
              <button className="close-button" onClick={() => setShowSortModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body sort-options">
              <div className="sort-option">
                <input
                  type="radio"
                  id="price-low-high"
                  name="sort"
                  value="price-low-high"
                  checked={sortOption === 'price-low-high'}
                  onChange={() => applySort('price-low-high')}
                />
                <label htmlFor="price-low-high">Price: Low to High</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="price-high-low"
                  name="sort"
                  value="price-high-low"
                  checked={sortOption === 'price-high-low'}
                  onChange={() => applySort('price-high-low')}
                />
                <label htmlFor="price-high-low">Price: High to Low</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="name-a-z"
                  name="sort"
                  value="name-a-z"
                  checked={sortOption === 'name-a-z'}
                  onChange={() => applySort('name-a-z')}
                />
                <label htmlFor="name-a-z">Name: A to Z</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="name-z-a"
                  name="sort"
                  value="name-z-a"
                  checked={sortOption === 'name-z-a'}
                  onChange={() => applySort('name-z-a')}
                />
                <label htmlFor="name-z-a">Name: Z to A</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="quantity-low-high"
                  name="sort"
                  value="quantity-low-high"
                  checked={sortOption === 'quantity-low-high'}
                  onChange={() => applySort('quantity-low-high')}
                />
                <label htmlFor="quantity-low-high">Quantity: Low to High</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="quantity-high-low"
                  name="sort"
                  value="quantity-high-low"
                  checked={sortOption === 'quantity-high-low'}
                  onChange={() => applySort('quantity-high-low')}
                />
                <label htmlFor="quantity-high-low">Quantity: High to Low</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowSortModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
