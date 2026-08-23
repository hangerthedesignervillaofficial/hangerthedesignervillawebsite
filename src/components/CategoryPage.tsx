'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { useProductsByCategory } from '@/hooks/queries'
import { ErrorState } from '@/components/ErrorState'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Link from 'next/link'

interface CategoryPageProps {
	categoryName: string
	categoryId: number
}

// Category descriptions for the hero section
const categoryDescriptions: Record<string, string> = {
	'Footwear': 'Step into elegance with our curated selection of designer footwear, from statement heels to everyday luxury.',
	'Clothing': 'Discover timeless silhouettes and contemporary designs crafted from the finest fabrics for the modern woman.',
	'Jewellery': 'Adorn yourself with exquisite pieces that tell a story — from minimalist gold to statement gemstones.',
	'Accessories': 'Complete your ensemble with our handpicked accessories — bags, scarves, and more to elevate every look.',
	'Electronics': 'Premium tech accessories designed with aesthetics and functionality in mind.',
}

// Sort options
const sortOptions = [
	{ label: 'NEWEST', value: 'newest' },
	{ label: 'PRICE: LOW TO HIGH', value: 'price-asc' },
	{ label: 'PRICE: HIGH TO LOW', value: 'price-desc' },
	{ label: 'NAME: A-Z', value: 'name-asc' },
]

export default function CategoryPage({
	categoryName,
	categoryId,
}: CategoryPageProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [sortBy, setSortBy] = useState('newest')
	const [showFilters, setShowFilters] = useState(false)

	const {
		data: products,
		isLoading: loading,
		error,
		refetch: fetchProducts,
	} = useProductsByCategory(categoryId)

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		if (!products) return []

		let filtered = products
		if (searchTerm.trim() !== '') {
			filtered = filtered.filter(
				(product) =>
					product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(product.description?.toLowerCase() || '').includes(
						searchTerm.toLowerCase()
					)
			)
		}

		// Sort
		const sorted = [...filtered]
		switch (sortBy) {
			case 'price-asc':
				sorted.sort((a, b) => a.price - b.price)
				break
			case 'price-desc':
				sorted.sort((a, b) => b.price - a.price)
				break
			case 'name-asc':
				sorted.sort((a, b) => a.title.localeCompare(b.title))
				break
			default:
				break
		}
		return sorted
	}, [searchTerm, products, sortBy])

	const description = categoryDescriptions[categoryName] || 'Explore our curated luxury collection.'

	return (
		<ErrorBoundary>
			<div className="bg-[#FDFBF7] min-h-screen">
					{/* Hero Banner */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6 }}
					className="bg-gradient-to-b from-[#FFFDFC] to-[#FDFBF7] text-[#2C1810] py-8 md:py-12 border-b border-[#D4AF37]/20 relative overflow-hidden"
				>
					{/* Decorative elements */}
					<div className="absolute inset-0 opacity-[0.02]" style={{
						backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212,175,55,0.5) 35px, rgba(212,175,55,0.5) 36px)'
					}} />
					{/* Golden inner border frame */}
					<div className="absolute inset-3 border border-[#D4AF37]/15 pointer-events-none" />
					
					<div className="container mx-auto px-6 relative z-10">
						{/* Breadcrumbs */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.4 }}
							className="flex items-center gap-2 mb-5"
						>
							<Link href="/" className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#7A6B5D]/60 hover:text-[#D4AF37] transition-colors">
								Home
							</Link>
							<span className="text-[#D4AF37] text-[6px]">●</span>
							<span className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#4A0E17] font-bold">
								{categoryName}
							</span>
						</motion.div>
 
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="max-w-2xl text-left"
						>
							<div className="flex items-center gap-3 mb-2">
								<div className="w-6 h-[1px] bg-[#D4AF37]" />
								<span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
									Collection
								</span>
							</div>
							<h1 className="font-serif text-3xl md:text-5xl font-normal tracking-wide uppercase mb-3 leading-none text-[#2C1810]" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
								{categoryName}
							</h1>
							<p className="font-sans text-xs md:text-sm text-[#7A6B5D] leading-relaxed max-w-lg">
								{description}
							</p>
						</motion.div>
					</div>
				</motion.div>

				{/* Filter & Search Bar */}
				<div className="sticky top-16 md:top-20 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#D4AF37]/10">
					<div className="container mx-auto px-4">
						<div className="flex items-center justify-between h-14 gap-4">
							{/* Left: Product count */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
								className="hidden md:flex items-center"
							>
								<span className="font-sans text-[10px] tracking-[0.15em] text-[#7A6B5D] uppercase">
									{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
								</span>
							</motion.div>

							{/* Center: Search */}
							<div className="flex-1 max-w-md mx-auto relative">
								<div className="flex items-center gap-2.5">
									<Search className="h-3.5 w-3.5 text-[#D4AF37] flex-shrink-0" />
									<input
										type="text"
										placeholder={`Search ${categoryName.toLowerCase()}...`}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none h-9 font-sans text-xs tracking-wider text-[#2C1810] placeholder:text-[#7A6B5D]/40 transition-colors"
									/>
									{searchTerm && (
										<button
											onClick={() => setSearchTerm('')}
											className="text-[#7A6B5D] hover:text-[#4A0E17] cursor-pointer flex-shrink-0 transition-colors"
										>
											<X className="h-3 w-3 stroke-[1.5]" />
										</button>
									)}
								</div>
							</div>

							{/* Right: Sort & Filter */}
							<div className="flex items-center gap-3">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className={`flex items-center gap-1.5 cursor-pointer transition-colors ${showFilters ? 'text-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}`}
								>
									<SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.5]" />
									<span className="hidden md:inline font-sans text-[9px] font-semibold tracking-[0.15em] uppercase">
										Sort
									</span>
								</button>
							</div>
						</div>

						{/* Sort Dropdown */}
						<AnimatePresence>
							{showFilters && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden"
								>
									<div className="flex flex-wrap items-center gap-2 pb-3">
										{sortOptions.map((opt) => (
											<button
												key={opt.value}
												onClick={() => { setSortBy(opt.value); setShowFilters(false); }}
												className={`px-4 py-2 text-[9px] font-sans font-bold tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 ${
													sortBy === opt.value
														? 'bg-[#2C1810] text-white'
														: 'bg-transparent text-[#7A6B5D] border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 hover:text-[#2C1810]'
												}`}
											>
												{opt.label}
											</button>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Products Grid */}
				<div className="container mx-auto px-4 py-10 md:py-14">
					<AnimatePresence mode="wait">
						{loading ? (
							<motion.div
								key="loader"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center min-h-[300px] gap-4"
							>
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 1.2,
										repeat: Infinity,
										ease: 'linear',
									}}
									className="h-8 w-8 rounded-full border-t-2 border-b-2 border-[#D4AF37]"
								/>
								<span className="text-[10px] font-sans tracking-[0.2em] text-[#7A6B5D] uppercase">
									Loading Collection...
								</span>
							</motion.div>
						) : error ? (
							<motion.div
								key="error"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<ErrorState
									title={`Failed to load ${categoryName.toLowerCase()}`}
									description={`We couldn't load the ${categoryName.toLowerCase()} products. Please try again.`}
									onRetry={fetchProducts}
									error={error}
									type="network"
								/>
							</motion.div>
						) : filteredProducts.length === 0 ? (
							<motion.div
								key="empty"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center min-h-[300px] gap-4"
							>
								<div className="w-16 h-16 border border-[#D4AF37]/20 flex items-center justify-center">
									<Search className="h-6 w-6 text-[#D4AF37]/40" />
								</div>
								<div className="text-center">
									<h3 className="font-serif text-lg text-[#2C1810] tracking-wide mb-1" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
										{searchTerm ? 'No Results Found' : `No ${categoryName} Available`}
									</h3>
									<p className="font-sans text-[11px] text-[#7A6B5D] tracking-wide">
										{searchTerm
											? `We couldn\u2019t find anything matching \u201C${searchTerm}\u201D`
											: `New ${categoryName.toLowerCase()} arriving soon. Check back later.`}
									</p>
								</div>
								{searchTerm && (
									<button
										onClick={() => setSearchTerm('')}
										className="mt-2 font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#D4AF37] hover:text-[#4A0E17] transition-colors cursor-pointer"
									>
										Clear Search
									</button>
								)}
							</motion.div>
						) : (
							<motion.div
								key="products"
								className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.4 }}
							>
								<AnimatePresence>
									{filteredProducts.map((product, index) => (
										<motion.div
											key={product.product_id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{
												duration: 0.3,
												delay: index * 0.05,
											}}
										>
											<ProductCard product={product} />
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</ErrorBoundary>
	)
}
