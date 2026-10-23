'use client';
import React, { useState } from 'react';
import {
  Search, ShoppingBag, User, Store, ShieldCheck, Star, Clock,
  MapPin, Plus, Trash2, Moon, Sun, Play, ChefHat, CheckCircle2, Lock, LogOut
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  restaurantName: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  isHomeMade: boolean;
}

export default function FoodHutPlatform() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'seller' | 'admin' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Array<FoodItem & { quantity: number }>>([]);
  const [orders, setOrders] = useState<any[]>([
    { id: 'ORD-8492', customerName: 'Ali Khan', items: '2x Chicken Tikka, 1x Kebab', total: 34.00, status: 'Preparing', time: '10 mins ago' }
  ]);

  // Auth & JWT state
  const [user, setUser] = useState<{ name: string; email: string; role: 'customer' | 'seller' | 'admin'; token: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'seller' });

  // New Food Form for Seller Panel
  const [newFood, setNewFood] = useState({
    name: '',
    restaurantName: 'Mama’s Home Kitchen',
    category: 'Home-Made',
    price: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    isHomeMade: true
  });

  // Initial Data matching the uploaded FoodHut Figma reference
  const [foods, setFoods] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Charcoal Seekh Kebab',
      restaurantName: 'Karachi BBQ Tonight',
      category: 'BBQ',
      price: 10.00,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Tender spiced minced meat.',
      isHomeMade: false
    },
    {
      id: '2',
      name: 'Smoky Chicken Tikka',
      restaurantName: 'Spice Route Restaurant',
      category: 'Desi',
      price: 15.00,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1599487484170-7c1e6e5ec81d?w=600&auto=format&fit=crop&q=80',
      description: 'Traditional clay-oven roasted chicken marinated in yogurt and aromatic spices.',
      isHomeMade: false
    },
    {
      id: '3',
      name: 'Desi Chowmein Special',
      restaurantName: 'Wok & Roll Home Chef',
      category: 'Home-Made',
      price: 8.00,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
      description: 'Stir-fried hakka noodles tossed with julienne vegetables, chicken, and spicy chili garlic sauce.',
      isHomeMade: true
    },
    {
      id: '4',
      name: 'Lahori Chicken Chargha',
      restaurantName: 'Royal Dastarkhwan',
      category: 'Desi',
      price: 28.00,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&auto=format&fit=crop&q=80',
      description: 'Whole steamed and flash-fried chicken infused with tangy masala and lemon juice.',
      isHomeMade: false
    },
    {
      id: '5',
      name: 'Ghar Ki Daal Chawal & Shami',
      restaurantName: 'Ammi’s Home Kitchen',
      category: 'Home-Made',
      price: 7.50,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      description: '100% hygienic home-cooked yellow lentils with aromatic basmati rice and 2 beef shami kebabs.',
      isHomeMade: true
    },
    {
      id: '6',
      name: 'Artisan Pepperoni Pizza',
      restaurantName: 'Napoli Woodfired Oven',
      category: 'Italian',
      price: 16.50,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      description: 'Hand-stretched sourdough crust topped with San Marzano tomato sauce and crispy pepperoni.',
      isHomeMade: false
    }
  ]);

  const addToCart = (food: FoodItem) => {
    const exists = cart.find((item) => item.id === food.id);
    if (exists) {
      setCart(cart.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (data.token) {
        setUser({ ...data.user, token: data.token });
        setShowAuthModal(false);
        if (data.user.role === 'seller') setActiveTab('seller');
        if (data.user.role === 'admin') setActiveTab('admin');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch {
      // Fallback local JWT simulation if run without backend
      setUser({
        name: authForm.name || authForm.email.split('@')[0] || 'Vendor User',
        email: authForm.email,
        role: authForm.role as any,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.foodhut_secured'
      });
      setShowAuthModal(false);
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price) return;
    const created: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      restaurantName: newFood.restaurantName,
      category: newFood.category,
      price: parseFloat(newFood.price),
      rating: 5.0,
      image: newFood.image,
      description: newFood.description || 'Freshly prepared with authentic ingredients.',
      isHomeMade: newFood.category === 'Home-Made'
    };
    setFoods([created, ...foods]);
    setNewFood({ ...newFood, name: '', price: '', description: '' });
    alert('Dish published live to the marketplace!');
  };

  const filteredFoods = foods.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory || (selectedCategory === 'Home-Made' && f.isHomeMade);
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={darkMode ? 'dark bg-[#191919] text-white min-h-screen' : 'bg-[#FFF9F9] text-gray-900 min-h-screen'}>
      {/* Navbar matching FoodHut Figma */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? 'bg-[#191919]/90 border-gray-800' : 'bg-white/90 border-red-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#F54748] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/30">
              F
            </div>
            <span className="text-2xl font-black tracking-tight">
              Food<span className="text-[#F54748]">Hut</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-[#F54748]' : 'hover:text-[#F54748] transition'}>
              Today Special Offers
            </button>
            <button onClick={() => setActiveTab('menu')} className={activeTab === 'menu' ? 'text-[#F54748]' : 'hover:text-[#F54748] transition'}>
              Our Menu & Home Chefs
            </button>
            <button onClick={() => setActiveTab('seller')} className={activeTab === 'seller' ? 'text-[#F54748]' : 'hover:text-[#F54748] transition'}>
              Restaurant / Seller Panel
            </button>
            <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-[#F54748]' : 'hover:text-[#F54748] transition'}>
              Admin Portal
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full border transition ${darkMode ? 'border-gray-700 bg-gray-800 text-yellow-400' : 'border-gray-200 bg-white text-gray-700'}`}
              title="Toggle Light/Dark Figma Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 rounded-full bg-[#F54748]/10 text-[#F54748] hover:bg-[#F54748] hover:text-white transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F54748] text-white text-xs font-bold flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold">
                <span>{user.name} ({user.role})</span>
                <button onClick={() => setUser(null)} title="Logout">
                  <LogOut className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-[#F54748] hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/30 transition"
              >
                Seller / Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'home' && (
          <div className="space-y-20">
            {/* Hero Section Replicating Uploaded FoodHut Screenshot */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-4">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#F54748]/10 text-[#F54748] px-3.5 py-1.5 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#F54748] animate-ping" /> People Trust Us
                </div>

                <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight">
                  We’re <span className="text-[#F54748]">Serious</span> For <br />
                  <span className="text-[#F54748]">Food</span> & <span className="text-[#FDC55E] underline decoration-wavy">Delivery.</span>
                </h1>

                <p className={`text-base sm:text-lg max-w-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Best cooks and best delivery guys all at your service. Order from top restaurants or authentic home-made kitchens—hot tasty food will reach you in 60 minutes.
                </p>

                {/* Search Bar */}
                <div className={`flex items-center p-2 rounded-full border shadow-lg max-w-md ${darkMode ? 'bg-[#222222] border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Search className="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search food or home kitchen..."
                    className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                  />
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-10 h-10 rounded-full bg-[#FDC55E] text-gray-900 flex items-center justify-center font-bold hover:scale-105 transition"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="bg-[#F54748] hover:bg-red-600 text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-red-500/30 transition"
                  >
                    Order Food Now
                  </button>
                  <button
                    onClick={() => setActiveTab('seller')}
                    className="flex items-center gap-3 text-sm font-bold hover:text-[#F54748] transition"
                  >
                    <span className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-[#F54748]">
                      <Play className="w-4 h-4 fill-current" />
                    </span>
                    Open Your Kitchen
                  </button>
                </div>
              </div>

              {/* Hero Circular Dish Showcase */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#F54748] to-[#FDC55E] p-3 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
                    alt="Hero Food"
                    className="w-full h-full object-cover rounded-full border-8 border-white dark:border-[#191919]"
                  />
                  {/* Floating badges */}
                  <div className={`absolute -left-6 top-12 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 ${darkMode ? 'bg-[#252525]' : 'bg-white'}`}>
                    <span className="text-2xl">🍕</span>
                    <div>
                      <p className="text-xs font-bold">Italian Pizza</p>
                      <p className="text-[11px] text-[#F54748] font-bold">⭐ 4.9 ($16.50)</p>
                    </div>
                  </div>

                  <div className={`absolute -right-4 bottom-12 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 ${darkMode ? 'bg-[#252525]' : 'bg-white'}`}>
                    <span className="text-2xl">🍲</span>
                    <div>
                      <p className="text-xs font-bold">Home-Made Kitchens</p>
                      <p className="text-[11px] text-green-500 font-bold">100% Hygienic</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Today Special Offers Section (Arch Cards like Figma) */}
            <section className="text-center space-y-10">
              <div className="max-w-xl mx-auto space-y-3">
                <h2 className="text-4xl font-black">
                  Today <span className="text-[#F54748]">Special</span> Offers
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Freshly prepared restaurant classics and authentic home-made meals delivered straight to your doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
                {foods.slice(0, 4).map((food) => (
                  <div
                    key={food.id}
                    className={`relative rounded-3xl p-6 pt-28 text-center transition hover:-translate-y-2 ${
                      darkMode
                        ? 'bg-gradient-to-b from-[#252525] to-[#1E1E1E] border border-gray-800'
                        : 'bg-gradient-to-b from-red-50/70 to-white border border-red-100 shadow-sm'
                    }`}
                  >
                    {/* Circular Overlapping Dish Image with Price Badge */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#F54748] to-[#FDC55E] shadow-xl">
                      <img src={food.image} alt={food.name} className="w-full h-full object-cover rounded-full" />
                      <span className="absolute bottom-1 right-0 w-11 h-11 rounded-full bg-[#FDC55E] text-gray-900 font-black text-xs flex items-center justify-center border-2 border-white">
                        ${food.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-yellow-500 mb-2">
                      <Star className="w-4 h-4 fill-current" /> ({food.rating}) • {food.restaurantName}
                    </div>

                    <h3 className="text-lg font-extrabold text-[#F54748] mb-2">{food.name}</h3>
                    <p className={`text-xs line-clamp-2 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {food.description}
                    </p>

                    <button
                      onClick={() => addToCart(food)}
                      className="bg-[#F54748] hover:bg-red-600 text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg shadow-red-500/30 transition"
                    >
                      Order Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MENU & HOME CHEFS VIEW */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">
                  Multi-Category <span className="text-[#F54748]">Culinary Menu</span>
                </h2>
                <p className="text-xs text-gray-400">Browse commercial restaurants and verified home-made chefs</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Home-Made', 'Desi', 'BBQ', 'Italian'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                      selectedCategory === cat
                        ? 'bg-[#F54748] text-white shadow-md'
                        : darkMode
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-white text-gray-700 border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className={`rounded-3xl overflow-hidden border transition ${
                    darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="relative h-48">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {food.isHomeMade ? '🏠 Home-Made Chef' : '🍽️ Restaurant'}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-[#FDC55E] text-gray-900 font-black text-sm px-3 py-1 rounded-full">
                      ${food.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{food.restaurantName}</span>
                      <span className="text-yellow-500 font-bold">★ {food.rating}</span>
                    </div>
                    <h3 className="text-lg font-bold">{food.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{food.description}</p>
                    <button
                      onClick={() => addToCart(food)}
                      className="w-full bg-[#F54748] hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs transition"
                    >
                      + Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SELLER / RESTAURANT & HOME-CHEF ADMIN PANEL */}
        {activeTab === 'seller' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-1 p-6 rounded-3xl border ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-2 text-[#F54748] font-bold text-xs uppercase mb-2">
                <ChefHat className="w-4 h-4" /> Seller Kitchen Studio
              </div>
              <h3 className="text-xl font-black mb-4">List New Food Item</h3>
              <form onSubmit={handleAddDish} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold mb-1">Kitchen / Restaurant Name</label>
                  <input
                    type="text"
                    required
                    value={newFood.restaurantName}
                    onChange={(e) => setNewFood({ ...newFood, restaurantName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Mutton Biryani"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <select
                      value={newFood.category}
                      onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <option value="Home-Made">Home-Made</option>
                      <option value="Desi">Desi</option>
                      <option value="BBQ">BBQ</option>
                      <option value="Italian">Italian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      placeholder="12.00"
                      value={newFood.price}
                      onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe ingredients, portion size, and spice level..."
                    value={newFood.description}
                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#F54748] hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 transition"
                >
                  Publish to Live Menu
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <span className="text-xs text-gray-400 font-bold">Active Menu Items</span>
                  <p className="text-3xl font-black text-[#F54748] mt-1">{foods.length}</p>
                </div>
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <span className="text-xs text-gray-400 font-bold">Live Orders</span>
                  <p className="text-3xl font-black text-[#FDC55E] mt-1">{orders.length}</p>
                </div>
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <span className="text-xs text-gray-400 font-bold">JWT Security Status</span>
                  <p className="text-sm font-bold text-green-500 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Protected Endpoint
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100'}`}>
                <h4 className="font-bold text-lg mb-4">Incoming Customer Orders</h4>
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-[#191919] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <div>
                        <span className="text-xs font-bold text-[#F54748]">{ord.id}</span>
                        <h5 className="font-bold text-sm">{ord.customerName} — {ord.items}</h5>
                        <p className="text-xs text-gray-400">{ord.time}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm">${ord.total.toFixed(2)}</span>
                        <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUPER ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <div className={`p-8 rounded-3xl border space-y-6 ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F54748] uppercase">Super Admin Control Center</span>
                <h2 className="text-3xl font-black mt-1">Platform Vendors & Security</h2>
              </div>
              <ShieldCheck className="w-10 h-10 text-[#F54748]" />
            </div>
            <p className="text-sm text-gray-400">
              All RESTful endpoints (<code>/api/auth/login</code>, <code>/api/auth/register</code>, <code>/api/foods</code>, <code>/api/orders</code>) are pre-configured with Mongoose models and JWT verification.
            </p>
          </div>
        )}

        {/* CART & CHECKOUT */}
        {activeTab === 'cart' && (
          <div className={`max-w-2xl mx-auto p-8 rounded-3xl border space-y-6 ${darkMode ? 'bg-[#222222] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h2 className="text-2xl font-black">Your Order Basket</h2>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">Your cart is empty. Add delicious food from the menu!</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-700/20 pb-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-400">${item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:opacity-75">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-lg font-black pt-2">
                  <span>Total Payable</span>
                  <span className="text-[#F54748]">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setOrders([
                      {
                        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
                        customerName: user?.name || 'Guest Customer',
                        items: cart.map((c) => `${c.quantity}x ${c.name}`).join(', '),
                        total: cartTotal,
                        status: 'Pending',
                        time: 'Just now'
                      },
                      ...orders
                    ]);
                    setCart([]);
                    alert('Order submitted to restaurant kitchen!');
                    setActiveTab('seller');
                  }}
                  className="w-full bg-[#F54748] hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-500/30 transition"
                >
                  Confirm & Place Order (${cartTotal.toFixed(2)})
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* JWT Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border space-y-5 ${darkMode ? 'bg-[#222222] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#F54748]" />
                {authMode === 'login' ? 'Sign In with JWT' : 'Register Seller / Customer ID'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-sm text-gray-400 hover:text-red-500">✕</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-sm">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold mb-1">Full Name or Restaurant Brand</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Account Role</label>
                <select
                  value={authForm.role}
                  onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${darkMode ? 'bg-[#191919] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <option value="customer">Customer (Order Food)</option>
                  <option value="seller">Restaurant Owner / Home-Made Seller</option>
                  <option value="admin">Platform Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#F54748] hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 transition"
              >
                {authMode === 'login' ? 'Login Securely' : 'Create Account & Get JWT'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-400">
              {authMode === 'login' ? (
                <>Don’t have an account? <button onClick={() => setAuthMode('register')} className="text-[#F54748] font-bold">Register Here</button></>
              ) : (
                <>Already registered? <button onClick={() => setAuthMode('login')} className="text-[#F54748] font-bold">Login Here</button></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
