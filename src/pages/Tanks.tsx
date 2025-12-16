import { useState } from 'react';
import { Droplets, Plus, Trash2, Edit2, Fish, Sprout } from 'lucide-react';
import { useSystemData, Tank, FishSpecies, PlantSpecies } from '../context/SystemDataContext';
import { useToast } from '../context/ToastContext';

export function Tanks() {
  const { system, addTank, updateTank, deleteTank, addFish, updateFish, deleteFish, addPlant, updatePlant, deletePlant } = useSystemData();
  const { success, error } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tank>>({});
  const [isAdding, setIsAdding] = useState(false);

  const [editingFishId, setEditingFishId] = useState<string | null>(null);
  const [fishFormData, setFishFormData] = useState<Partial<FishSpecies>>({});
  const [isAddingFish, setIsAddingFish] = useState<string | null>(null);

  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  const [plantFormData, setPlantFormData] = useState<Partial<PlantSpecies>>({});
  const [isAddingPlant, setIsAddingPlant] = useState<string | null>(null);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: '',
      type: 'grow-bed' as any,
      volume: 100,
      waterLevel: 75,
      temperature: 25,
      ph: 7,
      notes: '',
    });
  };

  const handleEditClick = (tank: Tank) => {
    setEditingId(tank.id);
    setFormData(tank);
  };

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.volume) {
      error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateTank(editingId, formData as Tank);
      success('Tank updated successfully');
    } else {
      addTank(formData as Tank);
      success('Tank added successfully');
    }

    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleDelete = (tankId: string) => {
    if (confirm('Are you sure you want to delete this tank?')) {
      deleteTank(tankId);
      success('Tank deleted');
    }
  };

  const handleAddFishClick = (tankId: string) => {
    setIsAddingFish(tankId);
    setEditingFishId(null);
    setFishFormData({ name: '', quantity: 1, size: 'medium' });
  };

  const handleSaveFish = (tankId: string) => {
    if (!fishFormData.name || !fishFormData.quantity) {
      error('Please fill in fish name and quantity');
      return;
    }

    if (editingFishId) {
      updateFish(editingFishId, fishFormData as FishSpecies);
      success('Fish updated');
    } else {
      addFish({ ...fishFormData as Omit<FishSpecies, 'id'>, tankId });
      success('Fish added');
    }

    setIsAddingFish(null);
    setEditingFishId(null);
    setFishFormData({});
  };

  const handleDeleteFish = (fishId: string) => {
    if (confirm('Delete this fish species?')) {
      deleteFish(fishId);
      success('Fish deleted');
    }
  };

  const handleAddPlantClick = (tankId: string) => {
    setIsAddingPlant(tankId);
    setEditingPlantId(null);
    setPlantFormData({ name: '', quantity: 1 });
  };

  const handleSavePlant = (tankId: string) => {
    if (!plantFormData.name || !plantFormData.quantity) {
      error('Please fill in plant name and quantity');
      return;
    }

    if (editingPlantId) {
      updatePlant(editingPlantId, plantFormData as PlantSpecies);
      success('Plant updated');
    } else {
      addPlant({ ...plantFormData as Omit<PlantSpecies, 'id'>, tankId });
      success('Plant added');
    }

    setIsAddingPlant(null);
    setEditingPlantId(null);
    setPlantFormData({});
  };

  const handleDeletePlant = (plantId: string) => {
    if (confirm('Delete this plant species?')) {
      deletePlant(plantId);
      success('Plant deleted');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tanks</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage your aquaponics tanks</p>
        </div>
        {!isAdding && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Tank
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Tank' : 'Add New Tank'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tank Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <select
              value={formData.type || 'grow-bed'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="grow-bed">Grow Bed</option>
              <option value="fish-tank">Fish Tank</option>
              <option value="settling-tank">Settling Tank</option>
            </select>
            <input
              type="number"
              placeholder="Volume (L)"
              value={formData.volume || ''}
              onChange={(e) => setFormData({ ...formData, volume: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Water Level (%)"
              value={formData.waterLevel || ''}
              onChange={(e) => setFormData({ ...formData, waterLevel: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Temperature (°C)"
              value={formData.temperature || ''}
              onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="pH"
              step="0.1"
              value={formData.ph || ''}
              onChange={(e) => setFormData({ ...formData, ph: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="sm:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
                setFormData({});
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {system.tanks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Droplets className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">No tanks yet. Add one to get started!</p>
        </div>
      ) : (
        <>

          <div className="space-y-6">
            {system.tanks.map((tank) => {
              const tankFish = system.fish.filter((f) => f.tankId === tank.id);
              const tankPlants = system.plants.filter((p) => p.tankId === tank.id);

              return (
                <div key={tank.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">

                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tank.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="capitalize">{tank.type.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>{tank.volume}L</span>
                        {tank.temperature && (
                          <>
                            <span>•</span>
                            <span>{tank.temperature}°C</span>
                          </>
                        )}
                        {tank.ph && (
                          <>
                            <span>•</span>
                            <span>pH {tank.ph}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(tank)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tank.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Fish className="w-5 h-5" /> Fish ({tankFish.length})
                      </h4>
                      {isAddingFish !== tank.id && (
                        <button
                          onClick={() => handleAddFishClick(tank.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        >
                          <Plus className="w-4 h-4" /> Add Fish
                        </button>
                      )}
                    </div>

                    {isAddingFish === tank.id && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded mb-3 space-y-2">
                        <input
                          type="text"
                          placeholder="Fish species name"
                          value={fishFormData.name || ''}
                          onChange={(e) => setFishFormData({ ...fishFormData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={fishFormData.quantity || 1}
                            onChange={(e) => setFishFormData({ ...fishFormData, quantity: Number(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Size"
                            value={fishFormData.size || 'medium'}
                            onChange={(e) => setFishFormData({ ...fishFormData, size: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveFish(tank.id)}
                            className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingFish(null);
                              setFishFormData({});
                            }}
                            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {tankFish.length === 0 ? (
                      <p className="text-sm text-gray-500">No fish species added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {tankFish.map((fish) => (
                          <div key={fish.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm">
                            <div>
                              <p className="font-medium">{fish.name}</p>
                              <p className="text-xs text-gray-500">Qty: {fish.quantity} • Size: {fish.size}</p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingFishId(fish.id);
                                  setFishFormData(fish);
                                  setIsAddingFish(tank.id);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFish(fish.id)}
                                className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Sprout className="w-5 h-5" /> Plants ({tankPlants.length})
                      </h4>
                      {isAddingPlant !== tank.id && (
                        <button
                          onClick={() => handleAddPlantClick(tank.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        >
                          <Plus className="w-4 h-4" /> Add Plant
                        </button>
                      )}
                    </div>

                    {isAddingPlant === tank.id && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded mb-3 space-y-2">
                        <input
                          type="text"
                          placeholder="Plant species name"
                          value={plantFormData.name || ''}
                          onChange={(e) => setPlantFormData({ ...plantFormData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={plantFormData.quantity || 1}
                            onChange={(e) => setPlantFormData({ ...plantFormData, quantity: Number(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                          />
                          <input
                            type="date"
                            placeholder="Last harvest"
                            value={plantFormData.harvestDate || ''}
                            onChange={(e) => setPlantFormData({ ...plantFormData, harvestDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSavePlant(tank.id)}
                            className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingPlant(null);
                              setPlantFormData({});
                            }}
                            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {tankPlants.length === 0 ? (
                      <p className="text-sm text-gray-500">No plant species added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {tankPlants.map((plant) => (
                          <div key={plant.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm">
                            <div>
                              <p className="font-medium">{plant.name}</p>
                              <p className="text-xs text-gray-500">Qty: {plant.quantity} {plant.harvestDate && `• Last harvest: ${plant.harvestDate}`}</p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingPlantId(plant.id);
                                  setPlantFormData(plant);
                                  setIsAddingPlant(tank.id);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePlant(plant.id)}
                                className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
