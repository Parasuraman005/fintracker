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
  DollarSign,
  Mail,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { MOCK_USER_PROFILE, MOCK_PERSONALIZATION, MOCK_FINANCE } from '../../data/mockData';
import { sendNotification, requestNotificationPermission } from '../../lib/notifications';

import { 
  UserProfile, 
  PersonalizationSettings as PersonalizationType, 
  FinanceSettings as FinanceType 
} from '../../types';

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
    <div className="space-y-4 pb-24 md:space-y-8 md:pb-8">
      <header className="flex items-center gap-3 md:gap-4">
        {activeSection !== 'main' && (
          <button 
            onClick={() => setActiveSection('main')}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 md:h-10 md:w-10"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
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
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id as SettingsSection)}
            className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/50 md:p-6"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl dark:bg-zinc-900 md:h-12 md:w-12", section.bg)}>
                <section.icon className={cn("h-5 w-5 md:h-6 md:w-6", section.color)} />
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white md:text-base">{section.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
          </button>
        ))}
      </div>

      <button
        onClick={async () => {
          const granted = await requestNotificationPermission();
          if (granted) {
            sendNotification('Test Notification', {
              body: 'This is a test notification from FinTrack! 🚀',
              tag: 'test-notification'
            });
          } else {
            alert('Notification permission denied. Please enable it in your browser settings.');
          }
        }}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 p-4 text-sm font-bold text-zinc-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400"
      >
        <Bell className="h-4 w-4" />
        Test Browser Notification
      </button>
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
    <div className="max-w-2xl space-y-4 md:space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
        <div className="mb-6 flex flex-col items-center md:mb-8">
          <div className="relative mb-3 md:mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-2xl font-bold dark:bg-zinc-900 md:h-24 md:w-24 md:text-3xl">
              {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg md:-bottom-2 md:-right-2 md:h-8 md:w-8">
              <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white md:text-xl">Profile Picture</h3>
          <p className="text-xs text-zinc-500 md:text-sm">Update your avatar and personal info</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Username</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setLocalProfile({ ...profile, username: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setLocalProfile({ ...profile, fullName: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setLocalProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 md:mt-8 md:gap-4">
          <button onClick={onBack} className="flex-1 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 md:py-4 md:text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 rounded-2xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 md:py-4 md:text-sm">
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
    <div className="max-w-2xl space-y-4 md:space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
        <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-zinc-900 md:h-12 md:w-12">
            <Palette className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white md:text-xl">Personalization</h3>
            <p className="text-xs text-zinc-500 md:text-sm">Configure your app experience</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Globe className="h-3 w-3" /> Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setLocalSettings({ ...settings, language: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Region
            </label>
            <select
              value={settings.region}
              onChange={(e) => setLocalSettings({ ...settings, region: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>India</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Time Zone
            </label>
            <select
              value={settings.timeZone}
              onChange={(e) => setLocalSettings({ ...settings, timeZone: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>UTC-5</option>
              <option>UTC+0</option>
              <option>UTC+5:30</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setLocalSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Time Format
            </label>
            <select
              value={settings.timeFormat}
              onChange={(e) => setLocalSettings({ ...settings, timeFormat: e.target.value as '12h' | '24h' })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Hash className="h-3 w-3" /> Number Format
            </label>
            <select
              value={settings.numberFormat}
              onChange={(e) => setLocalSettings({ ...settings, numberFormat: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>1,000.00</option>
              <option>1.000,00</option>
              <option>1 000,00</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-3 md:mt-12 md:gap-4">
          <button onClick={onBack} className="flex-1 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 md:py-4 md:text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 rounded-2xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 md:py-4 md:text-sm">
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
    <div className="max-w-2xl space-y-4 md:space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
        <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-zinc-900 md:h-12 md:w-12">
            <BadgeDollarSign className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white md:text-xl">Finance Settings</h3>
            <p className="text-xs text-zinc-500 md:text-sm">Manage your financial defaults</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <DollarSign className="h-3 w-3" /> Currency
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setLocalSettings({ ...settings, defaultCurrency: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="INR (₹)">INR (₹)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <CalendarDays className="h-3 w-3" /> First Day of Week
            </label>
            <select
              value={settings.firstDayOfWeek}
              onChange={(e) => setLocalSettings({ ...settings, firstDayOfWeek: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>Sunday</option>
              <option>Monday</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Wallet className="h-3 w-3" /> Default Wallet
            </label>
            <select
              value={settings.defaultWallet}
              onChange={(e) => setLocalSettings({ ...settings, defaultWallet: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option>Daily Cash</option>
              <option>HDFC Bank</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Hash className="h-3 w-3" /> Decimal Precision
            </label>
            <select
              value={settings.decimalPrecision}
              onChange={(e) => setLocalSettings({ ...settings, decimalPrecision: Number(e.target.value) })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            >
              <option value={0}>0 (1234)</option>
              <option value={1}>1 (1234.5)</option>
              <option value={2}>2 (1234.56)</option>
            </select>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Monthly Budget</label>
            <input
              type="number"
              value={settings.monthlyBudget}
              onChange={(e) => setLocalSettings({ ...settings, monthlyBudget: Number(e.target.value) })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white md:px-4 md:py-3 md:text-sm"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3 md:mt-12 md:gap-4">
          <button onClick={onBack} className="flex-1 rounded-2xl border border-zinc-200 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 md:py-4 md:text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 rounded-2xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 md:py-4 md:text-sm">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutSettings = ({ onBack }: { onBack: () => void }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const items = [
    { 
      id: 1, 
      label: 'Privacy Policy', 
      icon: ShieldCheck, 
      content: 'Your financial privacy is our priority. FinTrack employs end-to-end encryption for all sensitive data. We do not track, sell, or share your personal spending habits with third parties.' 
    },
    { 
      id: 2, 
      label: 'Terms & Conditions', 
      icon: FileText, 
      content: 'By using FinTrack, you agree to our fair-use policy. This app is a tool for financial planning and does not provide professional financial advice. User data is stored securely on your device.' 
    },
    { 
      id: 3, 
      label: 'App Version', 
      icon: Info, 
      content: 'v2.4.5 Build 2026. This version includes performance optimizations for real-time charting, enhanced mobile responsiveness, and a more robust local notification engine.' 
    },
    { 
      id: 4, 
      label: 'Contact Support', 
      icon: Mail, 
      isSupport: true
    },
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'FinTrack',
      text: 'Check out FinTrack - Your Ultimate Financial Buddy!',
      url: 'https://www.fictracker.netlify.app'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard: ' + shareData.url);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-emerald-600/40"
          >
            <img 
              src="/fintracker.png" 
              alt="FinTracker Logo" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white md:text-3xl">FinTrack</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">Your Ultimate Financial Buddy</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              PRO VERSION
            </span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              v2.4.5
            </span>
          </div>
        </div>

        <div className="grid gap-2 divide-y divide-zinc-100 dark:divide-zinc-900">
          {items.map((item) => (
            <div key={item.id} className="pt-2 first:pt-0">
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex w-full items-center justify-between py-4 px-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-zinc-800 dark:text-white md:text-base">{item.label}</span>
                </div>
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-300 transition-transform",
                  expandedId === item.id && "rotate-90 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                )}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 pl-14 pr-4">
                      {item.isSupport ? (
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Get in Touch</p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <a 
                              href="tel:+919710597141"
                              className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 hover:bg-emerald-50 hover:border-emerald-200 transition-colors dark:border-zinc-800 dark:hover:bg-emerald-900/10"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                                <Plus className="h-4 w-4 rotate-45" />
                              </div>
                              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">+91 9710597141</span>
                            </a>
                            <a 
                              href="mailto:gparasuraman20305@gmail.com"
                              className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 hover:bg-emerald-50 hover:border-emerald-200 transition-colors dark:border-zinc-800 dark:hover:bg-emerald-900/10"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                                <Mail className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">gparasuraman...</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                            "{item.content}"
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="pt-4 mt-2">
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-between p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition-all border border-emerald-100/50 dark:bg-emerald-900/10 dark:border-emerald-900/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <Share2 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-emerald-700 dark:text-emerald-400">Share the App</span>
                  <span className="text-[10px] font-medium text-emerald-600/60 dark:text-emerald-500/60">Invite friends to FinTrack</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-400" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4">
          <button 
            onClick={onBack}
            className="w-full rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-transform active:scale-[0.98]"
          >
            Return to Settings
          </button>
          <p className="text-center text-[10px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.2em]">
            Crafted with passion for financial freedom
          </p>
        </div>
      </div>
    </div>
  );
};
