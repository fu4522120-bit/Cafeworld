import React, { useState } from 'react';
import { MenuItem, CategoryId } from '../types';
import { HeroBanner } from './HeroBanner';

interface MenuCatalogProps {
  items: MenuItem[];
  onQuickAdd: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({ items, onQuickAdd, onCustomize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');

  const categories: { id: CategoryId | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: 'grid_view' },
    { id: 'hot-brews', label: 'Hot Brews', icon: 'local_cafe' },
    { id: 'cold-drinks', label: 'Cold & Frappes', icon: 'ac_unit' },
    { id: 'savoury-mains', label: 'Savoury & Mains', icon: 'lunch_dining' },
    { id: 'desserts', label: 'Desserts', icon: 'bakery_dining' },
  ];

  // Find hero item (Artisan Velvet Latte)
  const heroItem = items.find((i) => i.id === 'artisan-velvet-latte') || items[0];

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const scrollToCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    const element = document.getElementById(`section-${catId}`);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full text-[#e4e1e6]">
      {/* Search Input Bar */}
      <div className="mb-4 relative">
        <div className="relative flex items-center w-full bg-[#1b1b1e] border border-white/5 rounded-2xl px-4 py-3 shadow-inner">
          <span className="material-symbols-outlined text-[#ffb68c] text-[22px] mr-3">search</span>
          <input
            id="menu-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search espresso, Spanish latte, burgers, platters..."
            className="w-full bg-transparent font-sans text-sm text-[#e4e1e6] placeholder:text-[#a08d83]/70 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#a08d83] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Showcase (only shown when not searching) */}
      {!searchQuery && activeCategory === 'all' && (
        <HeroBanner item={heroItem} onQuickAdd={onQuickAdd} onCustomize={onCustomize} />
      )}

      {/* Category Pills Navigation */}
      <div className="sticky top-[108px] sm:top-[112px] z-30 bg-[#131316]/95 backdrop-blur-xl py-2.5 -mx-4 px-4 border-b border-white/5 mb-5 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => (cat.id === 'all' ? setActiveCategory('all') : scrollToCategory(cat.id))}
              className={`shrink-0 px-3.5 py-1.5 rounded-full font-space text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#c97f50] text-[#321200] font-bold shadow-md'
                  : 'bg-[#1b1b1e] hover:bg-[#2a2a2d] text-[#d8c2b7] hover:text-white border border-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu List Groups */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-[#1b1b1e] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#a08d83]">search_off</span>
          <p className="font-space text-sm text-[#d8c2b7]">
            No delicious items found matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="px-4 py-2 bg-[#2a2a2d] hover:bg-[#353438] text-white rounded-xl text-xs font-space font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 pb-12">
          {/* Group items by category if 'all', or show current category */}
          {(['hot-brews', 'cold-drinks', 'savoury-mains', 'desserts'] as CategoryId[])
            .filter((catId) => activeCategory === 'all' || activeCategory === catId)
            .map((catId) => {
              const catItems = filteredItems.filter((i) => i.category === catId);
              if (catItems.length === 0) return null;

              const catNames: Record<CategoryId, { title: string; subtitle: string; icon: string }> = {
                'hot-brews': { title: 'Hot Favorites', subtitle: 'Handcrafted Espresso & Teas', icon: 'local_cafe' },
                'cold-drinks': { title: 'Cold & Frappes', subtitle: 'Iced Blends & Nitro Drinks', icon: 'ac_unit' },
                'savoury-mains': { title: 'Savoury & Mains', subtitle: 'Johar Town Gourmet Kitchen', icon: 'lunch_dining' },
                'desserts': { title: 'Artisan Desserts', subtitle: 'Warm from in-house bakery', icon: 'bakery_dining' },
              };

              return (
                <section key={catId} id={`section-${catId}`} className="flex flex-col gap-3 scroll-mt-36">
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-[#c97f50]" />
                      <h3 className="font-headline text-lg sm:text-xl text-white font-bold">
                        {catNames[catId].title}
                      </h3>
                    </div>
                    <span className="text-xs font-space text-[#a08d83]">
                      {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className={`group relative p-4 rounded-2xl bg-[#1b1b1e] hover:bg-[#1f1f22] border transition-all flex flex-col justify-between gap-3 shadow-md ${
                          !item.isAvailable
                            ? 'opacity-60 border-red-500/20'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Out of Stock Ribbon if 86'd */}
                        {!item.isAvailable && (
                          <div className="absolute top-3 right-3 z-10 bg-red-950/90 text-red-300 border border-red-500/30 text-[10px] font-space px-2 py-0.5 rounded-full font-bold">
                            Sold Out Today
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col min-w-0 flex-grow">
                            {/* Clean unboxed metadata separator per constitution */}
                            <div className="flex items-center gap-1.5 text-[11px] font-space text-[#a08d83] mb-1">
                              {item.isBestseller && (
                                <>
                                  <span className="text-[#f5bc7e] font-semibold">Bestseller</span>
                                  <span aria-hidden="true" className="text-[#53443b]">·</span>
                                </>
                              )}
                              <span>{item.prepTimeMinutes}m prep</span>
                              {item.calories && (
                                <>
                                  <span aria-hidden="true" className="text-[#53443b]">·</span>
                                  <span>{item.calories} kcal</span>
                                </>
                              )}
                            </div>

                            <h4 className="font-headline text-base font-semibold text-white group-hover:text-[#ffb68c] transition-colors truncate">
                              {item.name}
                            </h4>

                            <p className="text-xs text-[#d8c2b7] line-clamp-2 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Item Thumbnail */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#0e0e11] shrink-0 overflow-hidden relative shadow-inner border border-white/5">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {item.rating && (
                              <div className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-space font-bold text-[#f5bc7e] flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span>{item.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Price and Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-baseline gap-2">
                            <span className="font-space text-base sm:text-lg text-[#ffb68c] font-bold">
                              Rs. {item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && (
                              <span className="font-space text-xs text-[#a08d83] line-through">
                                Rs. {item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Customize button */}
                            <button
                              disabled={!item.isAvailable}
                              onClick={() => onCustomize(item)}
                              title="Customize options (milk, size, syrup)"
                              className="p-1.5 rounded-lg bg-[#2a2a2d] hover:bg-[#353438] text-[#d8c2b7] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-[17px]">tune</span>
                            </button>

                            {/* Add button */}
                            <button
                              disabled={!item.isAvailable}
                              onClick={() => onQuickAdd(item)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#c97f50] hover:bg-[#ffb68c] text-[#321200] font-space text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-[15px]">add</span>
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
};
