import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  if (!user) return null;

  async function save() {
    setSaving(true);
    await updateProfile({ name: name.trim() || undefined });
    setMsg('Saved');
    toast.success('Profile saved');
    setTimeout(() => setMsg(null), 2000);
    setSaving(false);
  }

  function onAvatar(file?: File) {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error('Avatar too large', 'Max 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      // persist to users store
      try {
        const raw = localStorage.getItem('aqua_auth_users_v1');
        if (!raw) return;
        const users = JSON.parse(raw);
        if (users[user.id]) {
          users[user.id].avatar = data;
          localStorage.setItem('aqua_auth_users_v1', JSON.stringify(users));
          // update session as well
          const s = JSON.parse(localStorage.getItem('aqua_auth_session_v1') || 'null');
          if (s) {
            s.avatar = data;
            localStorage.setItem('aqua_auth_session_v1', JSON.stringify(s));
          }
          setAvatarPreview(data);
          toast.success('Avatar updated');
        }
      } catch (e) {
        toast.error('Avatar upload failed');
      }
    };
    reader.readAsDataURL(file);
  }

  async function changePw() {
    setPwLoading(true);
    const ok = await changePassword(oldPw, newPw);
    if (ok) {
      toast.success('Password changed');
      setOldPw('');
      setNewPw('');
    } else {
      toast.error('Password change failed', 'Old password is incorrect');
    }
    setPwLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-200">{user.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium">Avatar</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden">
                {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No</div>}
              </div>
              <div>
                <input
                  aria-label="Upload avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onAvatar(e.target.files?.[0])}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-slate-200 rounded px-3 py-2" />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className={`px-4 py-2 rounded text-white ${saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            {msg && <div className="text-sm text-emerald-600">{msg}</div>}
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Change password</h3>
            <div className="grid grid-cols-1 gap-2">
              <input type="password" placeholder="Current password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} className="block w-full border border-slate-200 rounded px-3 py-2" />
              <input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="block w-full border border-slate-200 rounded px-3 py-2" />
              <div className="flex items-center gap-2">
                <button onClick={changePw} disabled={pwLoading} className={`px-4 py-2 rounded text-white ${pwLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {pwLoading ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
