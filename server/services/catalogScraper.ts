import { type InsertProduct } from "@shared/schema";

export interface CatalogProduct {
  name: string;
  imageUrl: string;
  itemCount: number;
  categoryUrl: string;
  category: string;
  subcategory?: string;
}

export class CatalogScraperService {
  private baseUrl = "https://mamdejewellers.catalog.to";
  
  // Extract product categories from the fetched content
  extractProductCategories(htmlContent: string): CatalogProduct[] {
    const products: CatalogProduct[] = [];
    
    // Clean up the content and handle escaped characters
    const cleanContent = htmlContent.replace(/\\\\/g, '').replace(/\\\n/g, '\n');
    console.log('Processing content length:', cleanContent.length);
    
    // More robust regex patterns
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const linkRegex = /\[([^\]]*(\d+)\s+items[^\]]*)\]\(([^)]+)\s+"([^"]+)"\)/g;
    
    let imageMatch;
    let linkMatch;
    const imageUrls: string[] = [];
    
    // First pass: collect all image URLs
    while ((imageMatch = imageRegex.exec(cleanContent)) !== null) {
      imageUrls.push(imageMatch[2]);
    }
    
    console.log('Found images:', imageUrls.length);
    
    // Second pass: find product links
    let imageIndex = 0;
    while ((linkMatch = linkRegex.exec(cleanContent)) !== null) {
      const [, linkText, , categoryUrl, title] = linkMatch;
      
      console.log('Found link:', { linkText, title });
      
      // Extract item count
      const itemCountMatch = linkText.match(/(\d+)\s+items/);
      const itemCount = itemCountMatch ? parseInt(itemCountMatch[1], 10) : 0;
      
      if (itemCount > 0) {
        const { category, subcategory } = this.parseCategory(title);
        const imageUrl = imageUrls[imageIndex] || "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0";
        
        products.push({
          name: title,
          imageUrl,
          itemCount,
          categoryUrl: this.baseUrl + categoryUrl,
          category,
          subcategory
        });
        
        imageIndex++;
      }
    }
    
    return products;
  }
  
  private parseCategory(title: string): { category: string; subcategory?: string } {
    const titleLower = title.toLowerCase();
    
    // Map catalog categories to our system
    if (titleLower.includes('patta') || titleLower.includes('poth')) {
      return {
        category: 'necklaces',
        subcategory: titleLower.includes('long') ? 'long-chains' : 
                    titleLower.includes('short') ? 'short-chains' :
                    titleLower.includes('fancy') ? 'fancy-chains' : 'chains'
      };
    }
    
    if (titleLower.includes('necklace')) {
      return {
        category: 'necklaces',
        subcategory: titleLower.includes('temple') ? 'temple' :
                    titleLower.includes('fancy') ? 'fancy' :
                    titleLower.includes('arbi') ? 'arbi' : 'traditional'
      };
    }
    
    if (titleLower.includes('choker')) {
      return {
        category: 'necklaces',
        subcategory: 'chokers'
      };
    }
    
    // Default category mapping
    return {
      category: 'necklaces',
      subcategory: 'traditional'
    };
  }
  
  // Convert catalog products to our product schema
  convertToProducts(catalogProducts: CatalogProduct[]): InsertProduct[] {
    return catalogProducts.map(cp => ({
      name: cp.name,
      description: `Premium ${cp.name} - ${cp.itemCount} designs available`,
      category: cp.category,
      subcategory: cp.subcategory || 'traditional',
      weight: "25.0", // Default weight, would need actual product pages for real data
      purity: cp.name.includes('22K') ? '22K Gold' : 
              cp.name.includes('20K') ? '20K Gold' : '22K Gold',
      material: "gold",
      imageUrl: cp.imageUrl || "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0",
      featured: cp.itemCount > 50 ? 1 : 0, // Feature categories with more items
      region: cp.name.includes('Temple') ? 'South Indian' : undefined,
      pricePerGram: "6250.00"
    }));
  }
  
  // Main method to scrape and return products
  async scrapeProducts(htmlContent: string): Promise<InsertProduct[]> {
    try {
      console.log('Scraping products from content...');
      const catalogProducts = this.extractProductCategories(htmlContent);
      console.log(`Found ${catalogProducts.length} catalog products`);
      
      if (catalogProducts.length > 0) {
        console.log('Sample product:', catalogProducts[0]);
      }
      
      const products = this.convertToProducts(catalogProducts);
      console.log(`Converted to ${products.length} products`);
      return products;
    } catch (error) {
      console.error('Error scraping products:', error);
      return [];
    }
  }
}

export const catalogScraper = new CatalogScraperService();