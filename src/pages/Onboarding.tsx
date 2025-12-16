import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemData } from '../context/SystemDataContext';
import { useToast } from '../context/ToastContext';
import { ChevronRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { system, addTank, addFish, addPlant } = useSystemData();
  const toast = useToast();
  const [step, setStep] = useState<'tank' | 'fish' | 'plant' | 'complete'>(system.tanks.length > 0 ? 'fish' : 'tank');
  const [tankName, setTankName] = useState('');
  const [tankType, setTankType] = useState<'grow-bed' | 'fish-tank' | 'settling-tank'>('fish-tank');
  const [tankVolume, setTankVolume] = useState('50');
  const [fishName, setFishName] = useState('');
  const [fishQty, setFishQty] = useState('1');
  const [plantName, setPlantName] = useState('');
  const [plantQty, setPlantQty] = useState('1');

  function handleAddTank() {
    if (!tankName.trim()) {
      toast.error('Tank name required');
      return;
    }
    addTank({ name: tankName, type: tankType, volume: parseInt(tankVolume) || 50 });
    toast.success('Tank added');
    setTankName('');
    setStep('fish');
  }

  function handleAddFish() {
    if (!fishName.trim() || system.tanks.length === 0) {
      toast.error('Need fish name and at least one tank');
      return;
    }
    addFish({ name: fishName, quantity: parseInt(fishQty) || 1, size: 'medium', tankId: system.tanks[0].id });
    toast.success('Fish species added');
    setFishName('');
    setStep('plant');
  }

  function handleAddPlant() {
    if (!plantName.trim() || system.tanks.length === 0) {
      toast.error('Need plant name and at least one tank');
      return;
    }
    addPlant({ name: plantName, quantity: parseInt(plantQty) || 1, tankId: system.tanks[0].id });
    toast.success('Plant species added');
    setPlantName('');
    setStep('complete');
  }

  if (step === 'tank') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome to AquaPonics!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Let's set up your first aquaponics system. Start by adding a tank.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tank name</label>
              <input value={tankName} onChange={(e) => setTankName(e.target.value)} placeholder="e.g., Main System" className="w-full border border-slate-200 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tank type</label>
              <select value={tankType} onChange={(e) => setTankType(e.target.value as any)} className="w-full border border-slate-200 rounded px-3 py-2">
                <option value="fish-tank">Fish Tank</option>
                <option value="grow-bed">Grow Bed</option>
                <option value="settling-tank">Settling Tank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Volume (liters)</label>
              <input type="number" value={tankVolume} onChange={(e) => setTankVolume(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2" />
            </div>

            <button onClick={handleAddTank} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2">
              Add Tank <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'fish') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Add fish species</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">What fish are you raising? (optional—you can add more later)</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fish species</label>
              <input value={fishName} onChange={(e) => setFishName(e.target.value)} placeholder="e.g., Tilapia" className="w-full border border-slate-200 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input type="number" value={fishQty} onChange={(e) => setFishQty(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('plant')}
                className="flex-1 border border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded font-medium"
              >
                Skip
              </button>
              <button
                onClick={handleAddFish}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
              >
                Add Fish <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'plant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Add plant species</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">What plants are you growing? (optional—you can add more later)</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plant species</label>
              <input value={plantName} onChange={(e) => setPlantName(e.target.value)} placeholder="e.g., Lettuce" className="w-full border border-slate-200 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input type="number" value={plantQty} onChange={(e) => setPlantQty(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('complete')}
                className="flex-1 border border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded font-medium"
              >
                Skip
              </button>
              <button
                onClick={handleAddPlant}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
              >
                Add Plant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">System setup complete!</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Your aquaponics system is ready. Let's go to the dashboard.</p>
        <button onClick={() => navigate('/')} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
