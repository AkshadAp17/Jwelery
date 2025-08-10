import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2 } from 'lucide-react';

interface CatalogImportResponse {
  message: string;
  imported: number;
  products: any[];
}

export function CatalogImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (): Promise<CatalogImportResponse> => {
      const response = await fetch('/api/catalog/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to import catalog products');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Catalog Imported Successfully",
        description: `Imported ${data.imported} products from Mamde Jewellers catalog`,
      });
      
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/featured'] });
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: "Failed to import products from catalog",
        variant: "destructive",
      });
    }
  });

  const handleImport = () => {
    setIsImporting(true);
    importMutation.mutate();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Import Catalog Products
        </CardTitle>
        <CardDescription>
          Import jewelry products from Mamde Jewellers catalog to expand your collection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleImport}
          disabled={importMutation.isPending || isImporting}
          className="w-full"
          variant="default"
        >
          {importMutation.isPending || isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Import Products
            </>
          )}
        </Button>
        {importMutation.isError && (
          <p className="text-sm text-red-600 mt-2">
            Import failed. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}