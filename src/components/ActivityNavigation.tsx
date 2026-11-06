import React from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface ActivityStep {
  id: number;
  title: string;
  shortName: string;
  icon: string;
  description: string;
}

export const ACTIVITIES: ActivityStep[] = [
  { id: 1, title: 'Choose Country', shortName: '1. Country', icon: '🚩', description: 'Pick your nation & meet your trade diplomat' },
  { id: 2, title: 'Learn Products', shortName: '2. Products', icon: '📦', description: 'Discover natural advantages & what you need' },
  { id: 3, title: 'Buy Products (Import)', shortName: '3. Import', icon: '🚢', description: 'Purchase goods across world maritime lanes' },
  { id: 4, title: 'Sell Products (Export)', shortName: '4. Export', icon: '💰', description: 'Fulfill global demand & earn foreign revenue' },
  { id: 5, title: 'Negotiate Prices', shortName: '5. Bargain', icon: '🤝', description: 'Master price bargaining & partner trader moods' },
  { id: 6, title: 'Manage Money & Warehouse', shortName: '6. Storage', icon: '🏭', description: 'Balance warehouse crates & domestic production' },
  { id: 7, title: 'Solve Trade Problems', shortName: '7. Dilemmas', icon: '⚡', description: 'Handle canal bottlenecks, tariffs & harvest shocks' },
  { id: 8, title: 'Calculate Trade Values', shortName: '8. Math', icon: '🧮', description: 'Step-by-step export & import arithmetic ledger' },
  { id: 9, title: 'Surplus or Deficit Scale', shortName: '9. Balance', icon: '⚖️', description: 'Tilt the dynamic trade seesaw balance scale' },
  { id: 10, title: 'Final Challenge & Medal', shortName: '10. Exam', icon: '🏆', description: 'Earn your official Global Trader Certification' },
];

interface ActivityNavigationProps {
  currentActivity: number;
  completedActivities: number[];
  onSelectActivity: (id: number) => void;
}

export const ActivityNavigation: React.FC<ActivityNavigationProps> = ({
  currentActivity,
  completedActivities,
  onSelectActivity,
}) => {
  const currentStep = ACTIVITIES.find((a) => a.id === currentActivity) || ACTIVITIES[0];

  const handlePrev = () => {
    if (currentActivity > 1) {
      soundManager.playClick();
      onSelectActivity(currentActivity - 1);
    }
  };

  const handleNext = () => {
    if (currentActivity < ACTIVITIES.length) {
      soundManager.playClick();
      onSelectActivity(currentActivity + 1);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Step pill strip with horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300">
          {ACTIVITIES.map((act) => {
            const isActive = act.id === currentActivity;
            const isDone = completedActivities.includes(act.id);

            return (
              <button
                key={act.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectActivity(act.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{act.icon}</span>
                <span>{act.shortName}</span>
                {isDone && !isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Current Activity Banner with Prev/Next Controls */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">{currentStep.icon}</span>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Activity {currentStep.id}: {currentStep.title}</span>
                {completedActivities.includes(currentStep.id) && (
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-md">
                    Completed ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {currentStep.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentActivity <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentActivity >= ACTIVITIES.length}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <span>Next Activity</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
