import fs from 'fs';
let content = fs.readFileSync('src/components/admin/ProductFormModal.tsx', 'utf8');

// Update FormData interface
content = content.replace('is_new_arrival: boolean;\n  sizes: string;', 'is_new_arrival: boolean;\n  sizes: string;\n  display_tags: string[];');

// Update default state
content = content.replace('is_new_arrival: false,\n    sizes: "",', 'is_new_arrival: false,\n    sizes: "",\n    display_tags: [],');
content = content.replace('is_new_arrival: product.is_new_arrival || false,\n        sizes: (product.sizes || []).join(", "),', 'is_new_arrival: product.is_new_arrival || false,\n        sizes: (product.sizes || []).join(", "),\n        display_tags: product.display_tags || [],');

// Handle form submit mapping
content = content.replace('is_new_arrival: formData.is_new_arrival,\n        sizes: sizesArray,', 'is_new_arrival: formData.is_new_arrival,\n        sizes: sizesArray,\n        display_tags: formData.display_tags,');

// Handle toggling display_tags in UI
const tagsUI = `
          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Display Locations
            </Label>
            <div className="flex flex-wrap gap-4 mt-3">
              {["Shop by Mood", "Festive Edits", "Home Page Featured", "Clothing"].map(tag => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.display_tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("display_tags", [...formData.display_tags, tag]);
                      } else {
                        handleInputChange("display_tags", formData.display_tags.filter(t => t !== tag));
                      }
                    }}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span className="font-sans text-xs text-[#2C1810]">{tag}</span>
                </label>
              ))}
            </div>
          </div>
`;

content = content.replace('          <div>\n            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">\n              Collections\n            </Label>', tagsUI + '\n          <div>\n            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">\n              Collections\n            </Label>');

fs.writeFileSync('src/components/admin/ProductFormModal.tsx', content);
