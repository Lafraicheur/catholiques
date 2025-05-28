// components/sacrement-details/DocumentsGallery.tsx
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

interface ImageFile {
  url: string;
}

interface DocumentsGalleryProps {
  images: ImageFile[];
}

export function DocumentsGallery({ images }: DocumentsGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // Fonction pour extraire le nom du fichier depuis l'URL
  const getFileName = (url: string, index: number): string => {
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      return filename || `Image ${index + 1}`;
    } catch {
      return `Image ${index + 1}`;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Images jointes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const fileName = getFileName(image?.url, index);

          return (
            <div
              key={index}
              className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-3 border-b bg-slate-50">
                <div className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium truncate">{fileName}</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-slate-100 relative">
                  <img
                    src={image?.url}
                    alt={fileName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Si l'image ne se charge pas, on affiche un placeholder
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="aspect-video bg-slate-100 flex flex-col items-center justify-center p-4">
                            <div class="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                              </svg>
                            </div>
                            <p class="text-center text-slate-600 text-sm">Image non disponible</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
