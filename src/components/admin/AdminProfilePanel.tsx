import { CheckCircle2, KeyRound, ShieldCheck, UserCog } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import type { AdminProfileConfig } from '../../types';

interface AdminProfilePanelProps {
  profile: AdminProfileConfig;
  onProfileChange: (profile: AdminProfileConfig) => void;
  onNotify: (msg: string) => void;
}

export function AdminProfilePanel({
  profile,
  onProfileChange,
  onNotify,
}: AdminProfilePanelProps) {
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [adminEmail, setAdminEmail] = useState(profile.admin_email);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSaving(true);
    try {
      const res = await api.updateAdminProfile({
        display_name: displayName,
        admin_email: adminEmail,
      });
      if (res.error) {
        setProfileError(res.error);
      } else if (res.profile) {
        onProfileChange(res.profile);
        onNotify(t('تم تحديث بيانات المدير بنجاح.', 'Admin profile updated successfully.'));
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError(t('كلمة المرور الجديدة وتأكيدها غير متطابقين.', 'New password and confirmation do not match.'));
      return;
    }

    setPwdSaving(true);
    try {
      const res = await api.changeAdminPassword(currentPassword, newPassword);
      if (!res.success) {
        setPwdError(res.error || t('تعذر تغيير كلمة المرور.', 'Could not update password.'));
      } else {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        const msg = t('تم تغيير كلمة مرور لوحة الإدارة بنجاح.', 'Admin password updated successfully.');
        setPwdSuccess(msg);
        onNotify(msg);
      }
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Admin Display Name & Email */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
            <UserCog className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#064E3B]">
              {t('بيانات حساب المدير', 'Admin Profile Details')}
            </h2>
            <p className="text-xs text-slate-600">
              {t('تحديث الاسم الظاهر والبريد الإداري الأساسي للدخول.', 'Update display name and primary administrative email.')}
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="prof-name" className="block text-xs font-semibold text-slate-700 mb-1">
              {t('الاسم الظاهر للمدير', 'Admin Display Name')}
            </label>
            <input
              id="prof-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>
          <div>
            <label htmlFor="prof-email" className="block text-xs font-semibold text-slate-700 mb-1">
              {t('البريد الإداري الأساسي', 'Primary Admin Email')}
            </label>
            <input
              id="prof-email"
              type="email"
              dir="ltr"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>
          {profileError && <p className="text-xs text-red-600 font-semibold">{profileError}</p>}
          <button
            type="submit"
            disabled={profileSaving}
            className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            {profileSaving ? t('جاري الحفظ...', 'Saving...') : t('حفظ بيانات الحساب', 'Save Profile Details')}
          </button>
        </form>
      </div>

      {/* Change Admin Password */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#D4AF37] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#064E3B]">
              {t('تغيير كلمة مرور المدير', 'Change Admin Login Password')}
            </h2>
            <p className="text-xs text-slate-600">
              {t('حماية لوحة التحكم بكلمة مرور قوية (6 أحرف على الأقل).', 'Secure the Admin Console with a strong password (min 6 characters).')}
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="pwd-current" className="block text-xs font-semibold text-slate-700 mb-1">
              {t('كلمة المرور الحالية', 'Current Password')}
            </label>
            <input
              id="pwd-current"
              type="password"
              dir="ltr"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>
          <div>
            <label htmlFor="pwd-new" className="block text-xs font-semibold text-slate-700 mb-1">
              {t('كلمة المرور الجديدة', 'New Password')}
            </label>
            <input
              id="pwd-new"
              type="password"
              dir="ltr"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>
          <div>
            <label htmlFor="pwd-confirm" className="block text-xs font-semibold text-slate-700 mb-1">
              {t('تأكيد كلمة المرور الجديدة', 'Confirm New Password')}
            </label>
            <input
              id="pwd-confirm"
              type="password"
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>

          {pwdError && <p className="text-xs text-red-600 font-semibold">{pwdError}</p>}
          {pwdSuccess && (
            <p className="text-xs text-[#059669] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{pwdSuccess}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={pwdSaving}
            className="w-full py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>{pwdSaving ? t('جاري التحديث...', 'Updating...') : t('تحديث كلمة المرور', 'Update Password')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
