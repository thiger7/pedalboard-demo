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
    <button
      ref={setNodeRef}
      style={style}
      className={`effector-card ${effect.enabled ? 'enabled' : 'disabled'}`}
      onClick={handleClick}
      type="button"
    >
      <div className="effector-drag-handle" {...attributes} {...listeners}>
        <img
          src={effect.image}
          alt={effect.name}
          className="effector-image"
          draggable={false}
        />
      </div>
      <span className={`led-indicator ${effect.enabled ? 'on' : 'off'}`} />
      <div className="effector-info">
        <span className="effector-name">{effect.name}</span>
      </div>
    </button>
  );
}
