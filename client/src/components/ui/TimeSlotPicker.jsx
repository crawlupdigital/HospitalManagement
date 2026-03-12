import React from 'react';

const TimeSlotPicker = ({ slots = [], selectedSlot, onSelect, startHour = 9, endHour = 17 }) => {
  // Generate 15-min slots if none provided
  const generatedSlots = slots.length > 0 ? slots : (() => {
    const s = [];
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 15) {
        const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const endM = m + 15;
        const end = `${String(endM >= 60 ? h + 1 : h).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;
        s.push({ time: start, label: `${start}`, slot: `${start}-${end}`, available: true });
      }
    }
    return s;
  })();

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {generatedSlots.map((slot) => {
        const isSelected = selectedSlot === slot.slot || selectedSlot === slot.time;
        const isBooked = slot.available === false;
        return (
          <button
            key={slot.time}
            type="button"
            disabled={isBooked}
            onClick={() => onSelect(slot.slot || slot.time, slot.time)}
            className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all
              ${isBooked 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
                : isSelected 
                  ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
          >
            {slot.label || slot.time}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;
