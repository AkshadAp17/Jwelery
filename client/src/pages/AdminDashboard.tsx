import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CatalogImporter } from "@/components/CatalogImporter";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  material: 'gold' | 'silver';
  weight: string;
  purity: string;
  region?: string;
  images: string[];
  featured: number;
}

export default function AdminDashboard() {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    material: 'gold' as 'gold' | 'silver',
    weight: '',
    purity: '',
    region: '',
    featured: 0,
  });

  const categories = [
    { value: 'necklaces', label: 'Necklaces', subcategories: ['Chain Necklaces', 'Pendant Sets', 'Chokers', 'Long Chains'] },
    { value: 'haras', label: 'Haras', subcategories: ['Kundan Haras', 'Temple Haras', 'Polki Haras', 'Antique Haras'] },
    { value: 'mangalsutra', label: 'Mangalsutra', subcategories: ['Andhra Style', 'Maharashtrian Style', 'Rajasthani Style', 'Modern Style'] },
    { value: 'rings', label: 'Rings', subcategories: ['Wedding Rings', 'Engagement Rings', 'Daily Wear', 'Statement Rings'] },
    { value: 'earrings', label: 'Earrings', subcategories: ['Jhumkas', 'Chandbali', 'Studs', 'Hoops', 'Chandelier'] },
    { value: 'silver', label: 'Silver Items', subcategories: ['Silver Plates', 'Deepak/Diyas', 'Glasses', 'God Structures', 'Gift Sets'] },
  ];

  const selectedCategory = categories.find(c => c.value === form.category);

  // Fetch all products for admin
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/admin/products'],
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      resetForm();
      toast({
        title: "Product Created",
        description: "Product has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      toast({
        title: "Product Updated",
        description: "Product has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/products/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: '',
      subcategory: '',
      material: 'gold',
      weight: '',
      purity: '',
      region: '',
      featured: 0,
    });
    setSelectedImages(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory || '',
      material: product.material,
      weight: product.weight,
      purity: product.purity,
      region: product.region || '',
      featured: product.featured,
    });
    setIsProductDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (selectedImages) {
      Array.from(selectedImages).forEach((file) => {
        formData.append('images', file);
      });
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-navy">Admin Dashboard</h1>
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-white" onClick={() => {
                setEditingProduct(null);
                resetForm();
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value, subcategory: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedCategory && (
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={form.subcategory} onValueChange={(value) => setForm({ ...form, subcategory: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Select value={form.material} onValueChange={(value: 'gold' | 'silver') => setForm({ ...form, material: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (grams)</Label>
                    <Input
                      id="weight"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="purity">Purity</Label>
                    <Input
                      id="purity"
                      value={form.purity}
                      onChange={(e) => setForm({ ...form, purity: e.target.value })}
                      placeholder="e.g., 22K, 18K"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Region (optional)</Label>
                    <Input
                      id="region"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      placeholder="e.g., Andhra, Maharashtrian"
                    />
                  </div>

                  <div>
                    <Label htmlFor="featured">Featured</Label>
                    <Select value={String(form.featured)} onValueChange={(value) => setForm({ ...form, featured: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="images">Product Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedImages(e.target.files)}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Select multiple images. They will be uploaded to Cloudinary.
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="gold-gradient text-white"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending 
                      ? 'Saving...' 
                      : editingProduct ? 'Update Product' : 'Create Product'
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Image className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {product.featured === 1 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-gold text-white px-2 py-1 rounded text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span>{product.weight}g</span>
                        <span>{product.purity}</span>
                        <span className="capitalize">{product.material}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Product Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy">{products.length}</div>
                    <div className="text-sm text-gray-600">Total Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">{products.filter((p: Product) => p.featured === 1).length}</div>
                    <div className="text-sm text-gray-600">Featured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{products.filter((p: Product) => p.material === 'gold').length}</div>
                    <div className="text-sm text-gray-600">Gold Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{products.filter((p: Product) => p.material === 'silver').length}</div>
                    <div className="text-sm text-gray-600">Silver Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Admin settings will be available in future updates.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}