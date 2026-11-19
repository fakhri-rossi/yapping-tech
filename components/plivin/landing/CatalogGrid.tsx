import { TEMPLATE_DATA, FilterCategory } from '@config/gifts';
import TemplateCard from './TemplateCard';

interface CatalogGridProps {
  activeFilter: FilterCategory;
  onSelectTemplate: (templateTitle: string) => void;
}

export default function CatalogGrid({ activeFilter, onSelectTemplate }: CatalogGridProps) {
  // Show all templates in catalog (including featured templates)
  const filtered = TEMPLATE_DATA.filter((t) => {
    if (activeFilter === 'Semua') return true;
    return t.categories.includes(activeFilter);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-24">
      {filtered.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          variant="catalog"
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
}
