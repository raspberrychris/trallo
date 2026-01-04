import React, { useState, useEffect } from 'react';
import { Plus, Home, PoundSterling, CheckSquare, Calendar, Package, FileText, ChevronRight, Trash2, X, AlertCircle, Clock, CheckCircle2, Circle, Hammer, Sofa, Bath, ChefHat, Bed, TreeDeciduous, Lock, LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const roomIcons = {
  kitchen: ChefHat,
  bathroom: Bath,
  bedroom: Bed,
  living: Sofa,
  exterior: TreeDeciduous,
  other: Hammer
};

const statusStyles = {
  'not-started': { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Not Started' },
  'in-progress': { bg: 'bg-teal-50', text: 'text-teal-600', label: 'In Progress' },
  'completed': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Completed' },
  'on-hold': { bg: 'bg-red-50', text: 'text-red-400', label: 'On Hold' }
};

const priorityDots = {
  high: 'bg-red-400',
  medium: 'bg-teal-500',
  low: 'bg-gray-300'
};

const defaultData = {
  project: {
    name: 'Victorian House Renovation',
    address: '',
    startDate: '2024-01-15',
    targetEndDate: '2024-06-30',
    totalBudget: 75000,
    status: 'in-progress'
  },
  rooms: [
    { id: 1, name: 'Kitchen', type: 'kitchen', budget: 25000, spent: 18500, status: 'in-progress', notes: 'Complete remodel with new cabinets and appliances' },
    { id: 2, name: 'Master Bathroom', type: 'bathroom', budget: 15000, spent: 15000, status: 'completed', notes: 'New tiles, fixtures, and walk-in shower' },
    { id: 3, name: 'Living Room', type: 'living', budget: 8000, spent: 2200, status: 'in-progress', notes: 'New flooring and fireplace restoration' },
    { id: 4, name: 'Master Bedroom', type: 'bedroom', budget: 5000, spent: 0, status: 'not-started', notes: 'Built-in wardrobes and new windows' },
    { id: 5, name: 'Garden & Exterior', type: 'exterior', budget: 12000, spent: 3500, status: 'on-hold', notes: 'Landscaping and fence replacement' }
  ],
  tasks: [
    { id: 1, title: 'Install kitchen cabinets', roomId: 1, priority: 'high', status: 'in-progress', dueDate: '2024-02-15', assignee: 'Johnson Carpentry' },
    { id: 2, title: 'Connect plumbing for new sink', roomId: 1, priority: 'high', status: 'not-started', dueDate: '2024-02-20', assignee: 'Mike\'s Plumbing' },
    { id: 3, title: 'Paint living room walls', roomId: 3, priority: 'medium', status: 'not-started', dueDate: '2024-03-01', assignee: 'Self' },
    { id: 4, title: 'Install new light fixtures', roomId: 3, priority: 'low', status: 'not-started', dueDate: '2024-03-10', assignee: 'Bright Electrical' },
    { id: 5, title: 'Final bathroom inspection', roomId: 2, priority: 'high', status: 'completed', dueDate: '2024-01-30', assignee: 'Building Inspector' },
    { id: 6, title: 'Order bedroom windows', roomId: 4, priority: 'medium', status: 'not-started', dueDate: '2024-03-15', assignee: 'Self' }
  ],
  materials: [
    { id: 1, name: 'Shaker Cabinet Set', roomId: 1, quantity: 1, unit: 'set', unitPrice: 4500, purchased: true, supplier: 'Howdens' },
    { id: 2, name: 'Quartz Countertop', roomId: 1, quantity: 3.5, unit: 'm²', unitPrice: 350, purchased: true, supplier: 'Stone World' },
    { id: 3, name: 'Engineered Oak Flooring', roomId: 3, quantity: 28, unit: 'm²', unitPrice: 45, purchased: false, supplier: 'Flooring First' },
    { id: 4, name: 'Crown Paint - Soft Grey', roomId: 3, quantity: 10, unit: 'L', unitPrice: 35, purchased: false, supplier: 'B&Q' },
    { id: 5, name: 'Pendant Light Fixtures', roomId: 3, quantity: 3, unit: 'pcs', unitPrice: 120, purchased: false, supplier: 'Wayfair' },
    { id: 6, name: 'Double Glazed Windows', roomId: 4, quantity: 2, unit: 'pcs', unitPrice: 850, purchased: false, supplier: 'Everest' }
  ],
  notes: [
    { id: 1, title: 'Contractor Contacts', content: 'Johnson Carpentry: 07700 123456\nMike\'s Plumbing: 07700 234567\nBright Electrical: 07700 345678', date: '2024-01-10', pinned: true },
    { id: 2, title: 'Design Inspiration', content: 'Pinterest board: bit.ly/kitchen-ideas\nConsidering herringbone pattern for kitchen backsplash', date: '2024-01-05', pinned: false },
    { id: 3, title: 'Permit Information', content: 'Building permit #BP-2024-0456\nApproved: January 12, 2024\nInspection required before closing walls', date: '2024-01-12', pinned: true }
  ]
};

// Password Login Screen
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onLogin(password.trim().toLowerCase());
    } catch (err) {
      setError('Failed to connect. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-teal-500 flex items-center justify-center">
            <Home size={28} className="text-white" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">RenovatePro</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Enter your shared password to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Shared password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Connecting...
              </>
            ) : (
              'Enter'
            )}
          </button>
        </form>
        
        <p className="text-xs text-gray-400 text-center mt-6">
          Share this password with anyone you want to collaborate with
        </p>
      </div>
    </div>
  );
}

// Main App Component
function RenovationApp({ projectId, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [project, setProject] = useState(defaultData.project);
  const [rooms, setRooms] = useState(defaultData.rooms);
  const [tasks, setTasks] = useState(defaultData.tasks);
  const [materials, setMaterials] = useState(defaultData.materials);
  const [notes, setNotes] = useState(defaultData.notes);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('renovation_projects')
        .select('data')
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Load error:', error);
      }

      if (data?.data) {
        const savedData = data.data;
        setProject(savedData.project || defaultData.project);
        setRooms(savedData.rooms || defaultData.rooms);
        setTasks(savedData.tasks || defaultData.tasks);
        setMaterials(savedData.materials || defaultData.materials);
        setNotes(savedData.notes || defaultData.notes);
      }
    } catch (err) {
      console.error('Load error:', err);
    }
    
    setLoading(false);
  };

  // Save data to Supabase
  const saveData = async (newProject, newRooms, newTasks, newMaterials, newNotes) => {
    if (!supabase) return;
    
    setSaving(true);
    
    const dataToSave = {
      project: newProject,
      rooms: newRooms,
      tasks: newTasks,
      materials: newMaterials,
      notes: newNotes
    };

    try {
      const { error } = await supabase
        .from('renovation_projects')
        .upsert({
          project_id: projectId,
          data: dataToSave,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'project_id'
        });

      if (error) console.error('Save error:', error);
    } catch (err) {
      console.error('Save error:', err);
    }
    
    setSaving(false);
  };

  // Update functions that also save
  const updateRooms = (newRooms) => {
    setRooms(newRooms);
    saveData(project, newRooms, tasks, materials, notes);
  };

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    saveData(project, rooms, newTasks, materials, notes);
  };

  const updateMaterials = (newMaterials) => {
    setMaterials(newMaterials);
    saveData(project, rooms, tasks, newMaterials, notes);
  };

  const updateNotes = (newNotes) => {
    setNotes(newNotes);
    saveData(project, rooms, tasks, materials, newNotes);
  };

  const totalSpent = rooms.reduce((sum, room) => sum + room.spent, 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completedRooms = rooms.filter(r => r.status === 'completed').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'budget', label: 'Budget', icon: PoundSterling },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const formatCurrency = (amount) => `£${amount.toLocaleString()}`;
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const getRoomName = (roomId) => rooms.find(r => r.id === roomId)?.name || 'Unknown';

  const deleteTask = (id) => updateTasks(tasks.filter(t => t.id !== id));
  const deleteMaterial = (id) => updateMaterials(materials.filter(m => m.id !== id));
  const deleteNote = (id) => updateNotes(notes.filter(n => n.id !== id));
  const toggleMaterialPurchased = (id) => updateMaterials(materials.map(m => m.id === id ? {...m, purchased: !m.purchased} : m));
  const toggleTaskStatus = (id) => {
    updateTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const statusOrder = ['not-started', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(t.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      return {...t, status: nextStatus};
    }));
  };

  const ProgressBar = ({ value, max, showLabel = true, height = 'h-1' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const isOver = value > max;
    return (
      <div className="w-full">
        <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
          <div 
            className={`${height} rounded-full transition-all duration-700 ease-out ${isOver ? 'bg-red-400' : 'bg-teal-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between mt-1.5 text-xs text-gray-400">
            <span>{formatCurrency(value)}</span>
            <span className={isOver ? 'text-red-400' : ''}>{percentage.toFixed(0)}%</span>
          </div>
        )}
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const { bg, text, label } = statusStyles[status] || statusStyles['not-started'];
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  const Input = ({ label, ...props }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <input {...props} className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all" />
    </div>
  );

  const Select = ({ label, children, ...props }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <select {...props} className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all">
        {children}
      </select>
    </div>
  );

  const AddTaskForm = ({ onClose }) => {
    const [form, setForm] = useState({ title: '', roomId: rooms[0]?.id, priority: 'medium', dueDate: '', assignee: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      updateTasks([...tasks, { ...form, id: Date.now(), status: 'not-started' }]);
      onClose();
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Task Title" type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Room" value={form.roomId} onChange={e => setForm({...form, roomId: Number(e.target.value)})}>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>
          <Select label="Priority" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
          <Input label="Assignee" type="text" value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} />
        </div>
        <button type="submit" className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
          Add Task
        </button>
      </form>
    );
  };

  const AddMaterialForm = ({ onClose }) => {
    const [form, setForm] = useState({ name: '', roomId: rooms[0]?.id, quantity: 1, unit: 'pcs', unitPrice: 0, supplier: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      updateMaterials([...materials, { ...form, id: Date.now(), purchased: false }]);
      onClose();
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Material Name" type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Room" value={form.roomId} onChange={e => setForm({...form, roomId: Number(e.target.value)})}>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>
          <Input label="Supplier" type="text" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Quantity" type="number" min="0" step="0.1" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
          <Select label="Unit" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
            <option value="pcs">pcs</option>
            <option value="m²">m²</option>
            <option value="m">m</option>
            <option value="L">L</option>
            <option value="kg">kg</option>
            <option value="set">set</option>
          </Select>
          <Input label="Unit Price" type="number" min="0" step="0.01" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: Number(e.target.value)})} />
        </div>
        <button type="submit" className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
          Add Material
        </button>
      </form>
    );
  };

  const AddNoteForm = ({ onClose }) => {
    const [form, setForm] = useState({ title: '', content: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      updateNotes([...notes, { ...form, id: Date.now(), date: new Date().toISOString().split('T')[0], pinned: false }]);
      onClose();
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Content</label>
          <textarea rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none" />
        </div>
        <button type="submit" className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
          Add Note
        </button>
      </form>
    );
  };

  const AddRoomForm = ({ onClose }) => {
    const [form, setForm] = useState({ name: '', type: 'other', budget: 0, notes: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      updateRooms([...rooms, { ...form, id: Date.now(), spent: 0, status: 'not-started' }]);
      onClose();
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Room Name" type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Type" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="kitchen">Kitchen</option>
            <option value="bathroom">Bathroom</option>
            <option value="bedroom">Bedroom</option>
            <option value="living">Living Room</option>
            <option value="exterior">Exterior</option>
            <option value="other">Other</option>
          </Select>
          <Input label="Budget (£)" type="number" min="0" value={form.budget} onChange={e => setForm({...form, budget: Number(e.target.value)})} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Notes</label>
          <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none" />
        </div>
        <button type="submit" className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
          Add Room
        </button>
      </form>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1">{project.name}</h2>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1">Budget</p>
            <p className="text-xl font-semibold text-gray-900">{formatCurrency(project.totalBudget)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1">Start Date</p>
            <p className="text-xl font-semibold text-gray-900">{formatDate(project.startDate)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1">Target End</p>
            <p className="text-xl font-semibold text-gray-900">{formatDate(project.targetEndDate)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Spent', value: formatCurrency(totalSpent), accent: true },
          { label: 'Rooms Done', value: `${completedRooms}/${rooms.length}` },
          { label: 'Tasks Done', value: `${completedTasks}/${tasks.length}` },
          { label: 'Remaining', value: formatCurrency(project.totalBudget - totalSpent) }
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-4 ${stat.accent ? 'bg-teal-500 text-white' : 'bg-white border border-gray-100'}`}>
            <p className={`text-[11px] uppercase tracking-wider mb-1 ${stat.accent ? 'text-teal-100' : 'text-gray-400'}`}>{stat.label}</p>
            <p className={`text-xl font-semibold ${stat.accent ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 tracking-tight">Overall Budget Progress</h3>
        <ProgressBar value={totalSpent} max={project.totalBudget} height="h-2" />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 tracking-tight">Rooms & Areas</h3>
          <button onClick={() => setShowAddModal('room')} className="text-xs text-teal-500 hover:text-teal-600 font-medium flex items-center gap-1">
            <Plus size={14} /> Add Room
          </button>
        </div>
        <div className="space-y-2">
          {rooms.map(room => {
            const RoomIcon = roomIcons[room.type] || Hammer;
            return (
              <div key={room.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                  <RoomIcon size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-gray-800 text-sm">{room.name}</span>
                    <StatusBadge status={room.status} />
                  </div>
                  <div className="w-full max-w-xs">
                    <ProgressBar value={room.spent} max={room.budget} showLabel={false} height="h-1" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{formatCurrency(room.spent)}</p>
                  <p className="text-xs text-gray-400">of {formatCurrency(room.budget)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 tracking-tight">Upcoming Tasks</h3>
          <button onClick={() => setActiveTab('tasks')} className="text-xs text-teal-500 hover:text-teal-600 font-medium flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-1.5 h-1.5 rounded-full ${priorityDots[task.priority]}`} />
              <span className="flex-1 text-sm text-gray-700">{task.title}</span>
              <span className="text-xs text-gray-400">{getRoomName(task.roomId)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BudgetTab = () => {
    const totalAllocated = rooms.reduce((sum, r) => sum + r.budget, 0);
    const unallocated = project.totalBudget - totalAllocated;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Budget', value: formatCurrency(project.totalBudget), accent: true },
            { label: 'Total Spent', value: formatCurrency(totalSpent) },
            { label: 'Remaining', value: formatCurrency(project.totalBudget - totalSpent), positive: true },
            { label: 'Unallocated', value: formatCurrency(unallocated), negative: unallocated < 0 }
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 ${stat.accent ? 'bg-teal-500 text-white' : 'bg-white border border-gray-100'}`}>
              <p className={`text-[11px] uppercase tracking-wider mb-1 ${stat.accent ? 'text-teal-100' : 'text-gray-400'}`}>{stat.label}</p>
              <p className={`text-xl font-semibold ${stat.accent ? 'text-white' : stat.negative ? 'text-red-400' : stat.positive ? 'text-teal-500' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 tracking-tight">Budget by Room</h3>
          <div className="space-y-4">
            {rooms.map(room => {
              const percentage = (room.budget / project.totalBudget) * 100;
              const RoomIcon = roomIcons[room.type] || Hammer;
              return (
                <div key={room.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <RoomIcon size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 text-sm">{room.name}</span>
                        <span className="text-xs text-gray-400 ml-2">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-medium text-sm ${room.spent > room.budget ? 'text-red-400' : 'text-gray-800'}`}>
                        {formatCurrency(room.spent)}
                      </span>
                      <span className="text-gray-400 text-sm"> / {formatCurrency(room.budget)}</span>
                    </div>
                  </div>
                  <ProgressBar value={room.spent} max={room.budget} />
                  {room.spent > room.budget && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                      <AlertCircle size={12} />
                      <span>Over budget by {formatCurrency(room.spent - room.budget)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 tracking-tight">Materials Cost Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Room</th>
                  <th className="text-right py-3 px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Purchased</th>
                  <th className="text-right py-3 px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Pending</th>
                  <th className="text-right py-3 px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => {
                  const roomMaterials = materials.filter(m => m.roomId === room.id);
                  const purchased = roomMaterials.filter(m => m.purchased).reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);
                  const pending = roomMaterials.filter(m => !m.purchased).reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);
                  return (
                    <tr key={room.id} className="border-b border-gray-50">
                      <td className="py-3 px-3 text-gray-800">{room.name}</td>
                      <td className="py-3 px-3 text-right text-teal-500">{formatCurrency(purchased)}</td>
                      <td className="py-3 px-3 text-right text-gray-400">{formatCurrency(pending)}</td>
                      <td className="py-3 px-3 text-right font-medium text-gray-800">{formatCurrency(purchased + pending)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const TasksTab = () => {
    const groupedTasks = {
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      'not-started': tasks.filter(t => t.status === 'not-started'),
      'completed': tasks.filter(t => t.status === 'completed')
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Task Management</h3>
          <button onClick={() => setShowAddModal('task')} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Task
          </button>
        </div>

        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className={`px-4 py-3 border-b border-gray-50 ${statusStyles[status].bg}`}>
              <div className="flex items-center gap-2">
                {status === 'in-progress' && <Clock size={14} className={statusStyles[status].text} />}
                {status === 'not-started' && <Circle size={14} className={statusStyles[status].text} />}
                {status === 'completed' && <CheckCircle2 size={14} className={statusStyles[status].text} />}
                <span className={`text-xs font-medium uppercase tracking-wider ${statusStyles[status].text}`}>{statusStyles[status].label}</span>
                <span className="text-xs text-gray-400">({statusTasks.length})</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {statusTasks.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 text-center">No tasks</p>
              ) : (
                statusTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleTaskStatus(task.id)} className="mt-0.5 p-1 rounded hover:bg-gray-200 transition-colors">
                        {task.status === 'completed' ? (
                          <CheckCircle2 size={18} className="text-teal-500" />
                        ) : task.status === 'in-progress' ? (
                          <Clock size={18} className="text-teal-500" />
                        ) : (
                          <Circle size={18} className="text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full ${priorityDots[task.priority]}`} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{getRoomName(task.roomId)}</span>
                          {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
                          {task.assignee && <span>→ {task.assignee}</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TimelineTab = () => {
    const sortedTasks = [...tasks]
      .filter(t => t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const months = [...new Set(sortedTasks.map(t => {
      const d = new Date(t.dueDate);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }))];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Project Timeline</h3>
        
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          {months.map((month, monthIndex) => {
            const [year, m] = month.split('-');
            const monthName = new Date(year, m - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
            const monthTasks = sortedTasks.filter(t => t.dueDate.startsWith(month));

            return (
              <div key={month} className={`${monthIndex > 0 ? 'mt-8' : ''}`}>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-teal-500" />
                  {monthName}
                </h4>
                <div className="relative ml-4 pl-6 border-l border-gray-200 space-y-3">
                  {monthTasks.map(task => (
                    <div key={task.id} className="relative">
                      <div className={`absolute -left-[1.65rem] w-2.5 h-2.5 rounded-full border-2 border-white ${
                        task.status === 'completed' ? 'bg-teal-500' : 
                        task.status === 'in-progress' ? 'bg-teal-300' : 'bg-gray-200'
                      }`} />
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          <StatusBadge status={task.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{formatDate(task.dueDate)}</span>
                          <span>•</span>
                          <span>{getRoomName(task.roomId)}</span>
                          {task.assignee && (
                            <>
                              <span>•</span>
                              <span>{task.assignee}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {months.length === 0 && (
            <p className="text-center text-gray-400 py-8">No tasks with due dates scheduled</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="text-sm font-semibold text-gray-800 mb-4 tracking-tight">Room Progress</h4>
          <div className="space-y-3">
            {rooms.map(room => {
              const RoomIcon = roomIcons[room.type] || Hammer;
              const progress = room.budget > 0 ? (room.spent / room.budget) * 100 : 0;
              return (
                <div key={room.id} className="flex items-center gap-4">
                  <div className="w-28 flex items-center gap-2">
                    <RoomIcon size={14} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 truncate">{room.name}</span>
                  </div>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        room.status === 'completed' ? 'bg-teal-500' :
                        room.status === 'in-progress' ? 'bg-teal-300' :
                        room.status === 'on-hold' ? 'bg-red-300' : 'bg-gray-200'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-gray-500">
                      {statusStyles[room.status].label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const MaterialsTab = () => {
    const totalMaterialsCost = materials.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);
    const purchasedCost = materials.filter(m => m.purchased).reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Materials & Shopping List</h3>
          <button onClick={() => setShowAddModal('material')} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Material
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Materials', value: formatCurrency(totalMaterialsCost) },
            { label: 'Purchased', value: formatCurrency(purchasedCost), accent: true },
            { label: 'Still to Buy', value: formatCurrency(totalMaterialsCost - purchasedCost) }
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 ${stat.accent ? 'bg-teal-500 text-white' : 'bg-white border border-gray-100'}`}>
              <p className={`text-[11px] uppercase tracking-wider mb-1 ${stat.accent ? 'text-teal-100' : 'text-gray-400'}`}>{stat.label}</p>
              <p className={`text-xl font-semibold ${stat.accent ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Item</th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Room</th>
                  <th className="text-center py-3 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Qty</th>
                  <th className="text-right py-3 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Unit Price</th>
                  <th className="text-right py-3 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="text-center py-3 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {materials.map(material => (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-gray-800">{material.name}</span>
                        {material.supplier && <span className="block text-xs text-gray-400">{material.supplier}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{getRoomName(material.roomId)}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{material.quantity} {material.unit}</td>
                    <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(material.unitPrice)}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">{formatCurrency(material.quantity * material.unitPrice)}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => toggleMaterialPurchased(material.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          material.purchased 
                            ? 'bg-teal-50 text-teal-600' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {material.purchased ? '✓ Purchased' : 'To Buy'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteMaterial(material.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const NotesTab = () => {
    const sortedNotes = [...notes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Notes & Ideas</h3>
          <button onClick={() => setShowAddModal('note')} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedNotes.map(note => (
            <div key={note.id} className={`bg-white rounded-xl border overflow-hidden ${note.pinned ? 'border-teal-200' : 'border-gray-100'}`}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 text-sm flex items-center gap-2">
                    {note.pinned && <span className="text-teal-500 text-xs">●</span>}
                    {note.title}
                  </h4>
                  <button onClick={() => deleteNote(note.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                <p className="text-xs text-gray-300 mt-3">{formatDate(note.date)}</p>
              </div>
            </div>
          ))}
        </div>
        {notes.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">No notes yet. Add your first note to keep track of ideas.</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900 tracking-tight">RenovatePro</h1>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Home Renovation Planner</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saving && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Saving...
                </span>
              )}
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-100 sticky top-[65px] z-30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-teal-50 text-teal-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'materials' && <MaterialsTab />}
        {activeTab === 'notes' && <NotesTab />}
      </main>

      {/* Modals */}
      {showAddModal === 'task' && (
        <Modal title="Add New Task" onClose={() => setShowAddModal(null)}>
          <AddTaskForm onClose={() => setShowAddModal(null)} />
        </Modal>
      )}
      {showAddModal === 'material' && (
        <Modal title="Add New Material" onClose={() => setShowAddModal(null)}>
          <AddMaterialForm onClose={() => setShowAddModal(null)} />
        </Modal>
      )}
      {showAddModal === 'note' && (
        <Modal title="Add New Note" onClose={() => setShowAddModal(null)}>
          <AddNoteForm onClose={() => setShowAddModal(null)} />
        </Modal>
      )}
      {showAddModal === 'room' && (
        <Modal title="Add New Room" onClose={() => setShowAddModal(null)}>
          <AddRoomForm onClose={() => setShowAddModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// Main App with Auth
export default function App() {
  const [projectId, setProjectId] = useState(() => {
    return localStorage.getItem('renovation-project-id') || null;
  });

  const handleLogin = async (password) => {
    const id = password;
    localStorage.setItem('renovation-project-id', id);
    setProjectId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('renovation-project-id');
    setProjectId(null);
  };

  if (!projectId) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <RenovationApp projectId={projectId} onLogout={handleLogout} />;
}
