import { nanoid } from "nanoid";
import { type InsertProduct } from "@shared/schema";

export interface MamdeProductData {
  name: string;
  imageUrl: string;
  weight?: number;
  inStock?: boolean;
  category: string;
  material: string;
}

export class MamdeCatalogImporter {
  private categoryMappings = {
    'turkey-necklace': { category: 'necklaces', subcategory: 'traditional' },
    'mohan-mala': { category: 'necklaces', subcategory: 'traditional' },
    'thushi-har-22k': { category: 'necklaces', subcategory: 'thushi' },
    'make-on-order': { category: 'custom', subcategory: 'made-to-order' },
    'antique-poth-22k': { category: 'necklaces', subcategory: 'antique' },
    'gents-kada': { category: 'bracelets', subcategory: 'kada' },
    'yellow-bangles-22k': { category: 'bangles', subcategory: 'plain' },
    'temple-bangle-22k': { category: 'bangles', subcategory: 'temple' },
    'antique-bangles': { category: 'bangles', subcategory: 'antique' },
    'nmj-antique-22k': { category: 'antique', subcategory: 'nmj' }
  };

  extractProductsFromContent(content: string, categoryKey: string): MamdeProductData[] {
    const products: MamdeProductData[] = [];
    
    // Extract all image URLs from the content
    const imageUrls = this.extractImageUrls(content);
    console.log(`Found ${imageUrls.length} images for ${categoryKey}`);
    
    // Extract product details
    const productDetails = this.extractProductDetails(content);
    console.log(`Found ${productDetails.length} product details for ${categoryKey}`);
    
    const mapping = this.categoryMappings[categoryKey as keyof typeof this.categoryMappings];
    if (!mapping) {
      console.warn(`No mapping found for category: ${categoryKey}`);
      return [];
    }

    // Combine images with product details
    const maxItems = Math.max(imageUrls.length, productDetails.length);
    
    for (let i = 0; i < maxItems; i++) {
      const imageUrl = imageUrls[i];
      const detail = productDetails[i] || {};
      
      if (imageUrl) {
        products.push({
          name: detail.name || this.generateProductName(categoryKey, i + 1),
          imageUrl,
          weight: detail.weight || this.generateWeight(mapping.category),
          inStock: detail.inStock !== false,
          category: mapping.category,
          material: categoryKey.includes('22k') ? 'gold' : 'gold'
        });
      }
    }
    
    return products;
  }

  private extractImageUrls(content: string): string[] {
    const urls: string[] = [];
    
    // Multiple patterns to catch different image URL formats
    const patterns = [
      /https:\/\/cdn\.quicksell\.co\/[^"'\s)]+\.jpg/g,
      /!\[product grid tile image\]\(([^)]+\.jpg)[^)]*\)/g,
      /src="([^"]*cdn\.quicksell\.co[^"]*\.jpg)"/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1] || match[0];
        if (url.includes('cdn.quicksell.co') && url.includes('.jpg')) {
          const cleanUrl = url.replace(/[\\"\s]/g, '');
          if (cleanUrl.startsWith('https://')) {
            urls.push(cleanUrl);
          }
        }
      }
    });
    
    return Array.from(new Set(urls)); // Remove duplicates
  }

  private extractProductDetails(content: string): Array<{name?: string, weight?: number, inStock?: boolean}> {
    const details: Array<{name?: string, weight?: number, inStock?: boolean}> = [];
    const lines = content.split('\n');
    
    let currentDetail: {name?: string, weight?: number, inStock?: boolean} = { inStock: true };
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Extract product names from various formats
      if (trimmedLine.includes('ADD TO CART')) {
        // Try different name extraction patterns
        let nameMatch = trimmedLine.match(/\[([^\]]+)\]/);
        if (!nameMatch) {
          nameMatch = trimmedLine.match(/"([^"]+)"/);
        }
        if (!nameMatch && trimmedLine.includes('22K')) {
          nameMatch = trimmedLine.match(/([\w\s]+22K?)/);
        }
        
        if (nameMatch) {
          const name = nameMatch[1].replace(/\\n.*/, '').trim();
          if (name && name !== 'product grid tile image') {
            currentDetail.name = name;
          }
        }
      }
      
      // Extract weights
      const weightMatch = trimmedLine.match(/(\d+\.?\d*)\s*gm/);
      if (weightMatch) {
        currentDetail.weight = parseFloat(weightMatch[1]);
      }
      
      // Check stock status
      if (trimmedLine.includes('Out of Stock')) {
        currentDetail.inStock = false;
      }
      
      // When we have some product info, save it and reset
      if ((currentDetail.name || currentDetail.weight) && 
          (trimmedLine.includes('ADD TO CART') || trimmedLine.includes('Out of Stock'))) {
        details.push({ ...currentDetail });
        currentDetail = { inStock: true };
      }
    }
    
    return details;
  }

  private generateProductName(categoryKey: string, index: number): string {
    const categoryNames = {
      'turkey-necklace': 'Turkey Necklace',
      'mohan-mala': 'Mohan Mala',
      'thushi-har-22k': 'Thushi Har 22K',
      'make-on-order': 'Custom Design',
      'antique-poth-22k': 'Antique Poth 22K',
      'gents-kada': 'Gents Kada',
      'yellow-bangles-22k': 'Yellow Bangle 22K',
      'temple-bangle-22k': 'Temple Bangle 22K',
      'antique-bangles': 'Antique Bangle',
      'nmj-antique-22k': 'NMJ Antique 22K'
    };
    
    const baseName = categoryNames[categoryKey as keyof typeof categoryNames] || 'Gold Jewelry';
    return `${baseName} - Design ${index}`;
  }

  private generateWeight(category: string): number {
    // Generate realistic weights based on jewelry type
    const weightRanges = {
      'necklaces': [15, 45],
      'bangles': [8, 25],
      'bracelets': [12, 35],
      'antique': [20, 60],
      'custom': [10, 50]
    };
    
    const range = weightRanges[category as keyof typeof weightRanges] || [10, 30];
    return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
  }

  convertToInsertProducts(mamdeProducts: MamdeProductData[]): InsertProduct[] {
    return mamdeProducts.map(product => ({
      name: product.name,
      description: `Authentic ${product.name} from Mamde Jewellers catalog collection. Handcrafted with traditional techniques.`,
      category: product.category,
      subcategory: this.getSubcategory(product.category, product.name),
      weight: product.weight?.toString() || "20.0",
      purity: product.material === 'gold' ? '22K Gold' : '22K Gold',
      material: product.material,
      imageUrl: product.imageUrl,
      featured: Math.random() > 0.8 ? 1 : 0, // 20% chance to be featured
      region: this.getRegion(product.name),
      pricePerGram: "6250.00"
    }));
  }

  private getSubcategory(category: string, name: string): string {
    const nameLower = name.toLowerCase();
    
    if (category === 'necklaces') {
      if (nameLower.includes('temple')) return 'temple';
      if (nameLower.includes('antique')) return 'antique';
      if (nameLower.includes('thushi')) return 'thushi';
      if (nameLower.includes('turkey')) return 'traditional';
      return 'traditional';
    }
    
    if (category === 'bangles') {
      if (nameLower.includes('temple')) return 'temple';
      if (nameLower.includes('antique')) return 'antique';
      if (nameLower.includes('yellow')) return 'plain';
      return 'traditional';
    }
    
    if (category === 'bracelets') {
      if (nameLower.includes('kada')) return 'kada';
      return 'traditional';
    }
    
    return 'traditional';
  }

  private getRegion(name: string): string | undefined {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('temple') || nameLower.includes('thushi')) {
      return 'South Indian';
    }
    if (nameLower.includes('antique')) {
      return 'Traditional Indian';
    }
    return undefined;
  }
}

export const mamdeCatalogImporter = new MamdeCatalogImporter();