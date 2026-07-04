import { useState } from 'react';
import { 
  User, 
  Palette, 
  BadgeDollarSign, 
  Info,
  ChevronRight,
  ArrowLeft,
  Save,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Hash,
  Wallet,
  CalendarDays,
  ShieldCheck,
  FileText,
  LifeBuoy,
  Star,
  Share2,
  Plus,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MOCK_USER_PROFILE, MOCK_PERSONALIZATION, MOCK_FINANCE } from '../mockData';

import { 
  UserProfile, 
  PersonalizationSettings as PersonalizationType, 
  FinanceSettings as FinanceType 
} from '../types';

type SettingsSection = 'main' | 'profile' | 'personalization' | 'finance' | 'about';

interface SettingsPageProps {
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  personalization: PersonalizationType;
  setPersonalization: (p: PersonalizationType) => void;
  financeSettings: FinanceType;
  setFinanceSettings: (f: FinanceType) => void;
  setActiveTab: (tab: string) => void;
}

export default function SettingsPage({
  userProfile,
  setUserProfile,
  personalization,
  setPersonalization,
  financeSettings,
  setFinanceSettings
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSettings 
            profile={userProfile} 
            setProfile={setUserProfile} 
            onBack={() => setActiveSection('main')} 
          />
        );
      case 'personalization':
        return (
          <PersonalizationSettings 
            settings={personalization} 
            setSettings={setPersonalization} 
            onBack={() => setActiveSection('main')} 
          />
        );
      case 'finance':
        return (
          <FinanceSettings 
            settings={financeSettings} 
            setSettings={setFinanceSettings} 
            onBack={() => setActiveSection('main')} 
          />
        );
      case 'about':
        return <AboutSettings onBack={() => setActiveSection('main')} />;
      default:
        return <MainSettings onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="flex items-center gap-4">
        {activeSection !== 'main' && (
          <button 
            onClick={() => setActiveSection('main')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Settings
        </h1>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const MainSettings = ({ onNavigate }: { onNavigate: (s: SettingsSection) => void }) => {
  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'personalization', label: 'Personalization', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'finance', label: 'Finance Settings', icon: BadgeDollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'about', label: 'About FinTrack', icon: Info, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id as SettingsSection)}
          className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/50"
        >
          <div className="flex items-center gap-4">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl dark:bg-zinc-900", section.bg)}>
              <section.icon className={cn("h-6 w-6", section.color)} />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">{section.label}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-zinc-300 transition-transform group-hover:translate-x-1" />
        </button>
      ))}
    </div>
  );
};

const ProfileSettings = ({ 
  profile: initialProfile, 
  setProfile, 
  onBack 
}: { 
  profile: UserProfile, 
  setProfile: (p: UserProfile) => void, 
  onBack: () => void 
}) => {
  const [profile, setLocalProfile] = useState(initialProfile);

  const handleSave = () => {
    setProfile(profile);
    onBack();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-100 text-3xl font-bold dark:bg-zinc-900">
              {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Profile Picture</h3>
          <p className="text-sm text-zinc-500">Update your avatar and personal info</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">Username</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setLocalProfile({ ...profile, username: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setLocalProfile({ ...profile, fullName: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setLocalProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={onBack} className="flex-1 rounded-2xl border border-zinc-200 py-4 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const PersonalizationSettings = ({ 
  settings: initialSettings, 
  setSettings, 
  onBack 
}: { 
  settings: PersonalizationType, 
  setSettings: (s: PersonalizationType) => void, 
  onBack: () => void 
}) => {
  const [settings, setLocalSettings] = useState(initialSettings);

  const handleSave = () => {
    setSettings(settings);
    onBack();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-zinc-900">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Personalization</h3>
            <p className="text-sm text-zinc-500">Configure your app experience</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" /> Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setLocalSettings({ ...settings, language: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Region
            </label>
            <select
              value={settings.region}
              onChange={(e) => setLocalSettings({ ...settings, region: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>India</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Time Zone
            </label>
            <select
              value={settings.timeZone}
              onChange={(e) => setLocalSettings({ ...settings, timeZone: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>UTC-5</option>
              <option>UTC+0</option>
              <option>UTC+5:30</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setLocalSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Time Format
            </label>
            <select
              value={settings.timeFormat}
              onChange={(e) => setLocalSettings({ ...settings, timeFormat: e.target.value as '12h' | '24h' })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Hash className="h-3.5 w-3.5" /> Number Format
            </label>
            <select
              value={settings.numberFormat}
              onChange={(e) => setLocalSettings({ ...settings, numberFormat: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>1,000.00</option>
              <option>1.000,00</option>
              <option>1 000,00</option>
            </select>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button onClick={onBack} className="flex-1 rounded-2xl border border-zinc-200 py-4 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const FinanceSettings = ({ 
  settings: initialSettings, 
  setSettings, 
  onBack 
}: { 
  settings: FinanceType, 
  setSettings: (f: FinanceType) => void, 
  onBack: () => void 
}) => {
  const [settings, setLocalSettings] = useState(initialSettings);

  const handleSave = () => {
    setSettings(settings);
    onBack();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-zinc-900">
            <BadgeDollarSign className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Finance Settings</h3>
            <p className="text-sm text-zinc-500">Manage your financial defaults</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5" /> Currency
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setLocalSettings({ ...settings, defaultCurrency: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="INR (₹)">INR (₹)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" /> First Day of Week
            </label>
            <select
              value={settings.firstDayOfWeek}
              onChange={(e) => setLocalSettings({ ...settings, firstDayOfWeek: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>Sunday</option>
              <option>Monday</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" /> Default Wallet
            </label>
            <select
              value={settings.defaultWallet}
              onChange={(e) => setLocalSettings({ ...settings, defaultWallet: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option>Daily Cash</option>
              <option>HDFC Bank</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Hash className="h-3.5 w-3.5" /> Decimal Precision
            </label>
            <select
              value={settings.decimalPrecision}
              onChange={(e) => setLocalSettings({ ...settings, decimalPrecision: Number(e.target.value) })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option value={0}>0 (1234)</option>
              <option value={1}>1 (1234.5)</option>
              <option value={2}>2 (1234.56)</option>
            </select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase">Monthly Budget</label>
            <input
              type="number"
              value={settings.monthlyBudget}
              onChange={(e) => setLocalSettings({ ...settings, monthlyBudget: Number(e.target.value) })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button onClick={onBack} className="flex-1 rounded-2xl border border-zinc-200 py-4 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutSettings = ({ onBack }: { onBack: () => void }) => {
  const items = [
    { icon: Info, label: 'App Version', value: 'v1.2.0' },
    { icon: ShieldCheck, label: 'Privacy Policy' },
    { icon: FileText, label: 'Terms & Conditions' },
    { icon: LifeBuoy, label: 'Contact Support' },
    { icon: Star, label: 'Rate the App' },
    { icon: Share2, label: 'Share the App' },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white text-3xl font-bold shadow-xl shadow-emerald-600/20">
            FT
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">FinTrack</h2>
          <p className="text-sm text-zinc-500">Your Ultimate Financial Buddy</p>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item, i) => (
            <button
              key={i}
              className="flex w-full items-center justify-between py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-sm text-zinc-500">{item.value}</span>}
                <ChevronRight className="h-4 w-4 text-zinc-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
