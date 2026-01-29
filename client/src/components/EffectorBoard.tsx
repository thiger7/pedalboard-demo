import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { Effect } from '../types/effects';
import { EffectorCard } from './EffectorCard';

interface EffectorBoardProps {
  effects: Effect[];
  onEffectsChange: (effects: Effect[]) => void;
}

export function EffectorBoard({
  effects,
  onEffectsChange,
}: EffectorBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 動かさないとドラッグ開始しない
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms 長押しでドラッグ開始
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = effects.findIndex((e) => e.id === active.id);
      const newIndex = effects.findIndex((e) => e.id === over.id);
      onEffectsChange(arrayMove(effects, oldIndex, newIndex));
    }
  };

  const handleToggle = (id: string) => {
    onEffectsChange(
      effects.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)),
    );
  };

  const enabledCount = effects.filter((e) => e.enabled).length;

  return (
    <div className="effector-board-container">
      <div className="effector-board-header">
        <h2>Effect Chain</h2>
        <span className="enabled-count">
          {enabledCount} effect{enabledCount !== 1 ? 's' : ''} enabled
        </span>
      </div>
      <p className="effector-board-hint">
        Drag to reorder. Toggle ON/OFF to enable effects.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={effects.map((e) => e.id)}
          strategy={rectSortingStrategy}
        >
          <div className="effector-board">
            {effects.map((effect) => (
              <EffectorCard
                key={effect.id}
                effect={effect}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
