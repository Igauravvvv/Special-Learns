import { useId, useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * Accessible disclosure accordion.
 *
 * Follows the WAI-ARIA accordion pattern: each trigger is a <button> with
 * aria-expanded and aria-controls, and the panel is a labelled region.
 * Height animates via the grid-template-rows technique, so no JS measuring
 * and no layout jump.
 */
export default function Accordion({ items, allowMultiple = false, align = 'center', defaultOpen = null }) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState(
    defaultOpen === null ? [] : [defaultOpen],
  );

  const toggle = (id) => {
    setOpenItems((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={`accordion${align === 'left' ? ' accordion--left' : ''}`}>
      {items.map((item, index) => {
        const id = item.id ?? String(index);
        const triggerId = `${baseId}-trigger-${id}`;
        const panelId = `${baseId}-panel-${id}`;
        const isOpen = openItems.includes(id);

        return (
          <div className="accordion__item" key={id} data-open={isOpen}>
            <h3 style={{ margin: 0, fontSize: 'inherit', letterSpacing: 'normal' }}>
              <button
                type="button"
                id={triggerId}
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(id)}
              >
                <span>{item.question}</span>
                <span className="accordion__icon" aria-hidden="true">
                  <Plus size={17} />
                </span>
              </button>
            </h3>

            <div
              className="accordion__panel"
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
            >
              <div className="accordion__panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
