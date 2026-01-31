import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Effect } from '../types/effects';

interface EffectorCardProps {
  effect: Effect;
  onToggle: (id: string) => void;
}

export function EffectorCard({ effect, onToggle }: EffectorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: effect.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (!isDragging) {
      onToggle(effect.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`effector-card ${effect.enabled ? 'enabled' : 'disabled'}`}
      {...attributes}
      {...listeners}
    >
      {/* Mobile drag handle */}
      <div className="effector-drag-handle" aria-hidden="true">
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="currentColor"
          role="img"
          aria-label="Drag handle"
        >
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>
      <button className="effector-content" onClick={handleClick} type="button">
        <img
          src={effect.image}
          alt={effect.name}
          className="effector-image"
          draggable={false}
          loading="lazy"
        />
        <span className={`led-indicator ${effect.enabled ? 'on' : 'off'}`} />
        <div className="effector-info">
          <span className="effector-name">{effect.name}</span>
        </div>
      </button>
    </div>
  );
}
