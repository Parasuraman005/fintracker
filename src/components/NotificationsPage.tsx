import { useState } from 'react';
import { 
  Bell, 
  Settings, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { REMINDER_SETTINGS, MOCK_BUDGETS } from '../mockData';
import { ReminderSetting } from '../types';

export default function NotificationsPage() {
  const [reminders, setReminders] = useState<ReminderSetting[]>(REMINDER_SETTINGS);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isEnabled: !r.isEnabled } : r
    ));
  };

  const updateTime = (id: string, time: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, time } : r
    ));
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Notification
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Stay on top of your finances with automated reminders.
        </p>
      </header>

      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "rounded-2xl border bg-white p-6 shadow-sm transition-all dark:bg-zinc-950",
              reminder.isEnabled 
                ? "border-emerald-500/20 shadow-emerald-500/5" 
                : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                  reminder.isEnabled 
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                    : "bg-zinc-50 text-zinc-400 dark:bg-zinc-900"
                )}>
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">{reminder.title}</h3>
                  <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                    {reminder.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4 sm:border-0 sm:pt-0">
                {/* Auto Frequency Display */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Schedule</span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <Clock className="h-3 w-3" />
                    {reminder.frequency}
                  </div>
                </div>

                {/* Manual Time Selection */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Time</span>
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateTime(reminder.id, e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                {/* Budget Selection for Budget Reminder */}
                {reminder.budgetSelection !== undefined && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Budget</span>
                    <select
                      value={reminder.budgetSelection}
                      onChange={(e) => {
                        setReminders(reminders.map(r => 
                          r.id === reminder.id ? { ...r, budgetSelection: e.target.value } : r
                        ));
                      }}
                      className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    >
                      {MOCK_BUDGETS.map(b => (
                        <option key={b.id} value={b.category}>{b.category}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Toggle */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</span>
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      reminder.isEnabled ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                      reminder.isEnabled ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl bg-zinc-900 p-6 text-white dark:bg-emerald-600/10 dark:text-emerald-400">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5" />
          <h4 className="font-bold">Global Reminder Settings</h4>
        </div>
        <p className="mt-2 text-sm text-zinc-400 dark:text-emerald-400/80">
          Reminders are sent via push notifications. Ensure your device allows notifications for fintracker to receive timely updates.
        </p>
      </div>
    </div>
  );
}
