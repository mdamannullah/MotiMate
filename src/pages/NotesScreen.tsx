import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { getNotes, saveNotes, Note } from '@/services/mockData';
import { FileText, Plus, Search, Calendar, Trash2, Eye, X, Edit3, Save, Pin, PinOff } from 'lucide-react';
import { toast } from 'sonner';

export default function NotesScreen() {
  const { user, profile } = useAuth();
  const { addNotification, incrementNotes } = useData();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');

  const userSubjects = profile?.subjects || ['General', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const fetchNotes = () => {
    if (!user) return;
    setLoading(true);
    const userNotes = getNotes(user.id);
    setNotes(userNotes.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [user]);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const getSubjectColor = (subject: string | null) => {
    const colors: Record<string, string> = {
      'Biology': 'bg-success/10 text-success', 'Physics': 'bg-primary/10 text-primary',
      'Mathematics': 'bg-purple-500/10 text-purple-500', 'Chemistry': 'bg-destructive/10 text-destructive',
      'Computer Science': 'bg-blue-500/10 text-blue-500', 'English': 'bg-amber-500/10 text-amber-500',
    };
    return colors[subject || ''] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleAddNote = () => {
    if (!user || !newTitle.trim() || !newContent.trim()) { toast.error('Please fill in title and content'); return; }
    const newNote: Note = { id: crypto.randomUUID(), user_id: user.id, title: newTitle.trim(), content: newContent.trim(), subject: newSubject || null, color: '#FEF3C7', is_pinned: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const updatedNotes = [newNote, ...notes];
    saveNotes(user.id, updatedNotes);
    setNotes(updatedNotes);
    addNotification({ title: 'Note Saved', message: `Your note "${newTitle}" has been saved!`, type: 'achievement' });
    incrementNotes();
    toast.success('Note saved successfully! 📝');
    setShowAddModal(false); setNewTitle(''); setNewSubject(''); setNewContent('');
  };

  const handleUpdateNote = () => {
    if (!user || !selectedNote || !newTitle.trim() || !newContent.trim()) { toast.error('Please fill in title and content'); return; }
    const updatedNotes = notes.map(n => n.id === selectedNote.id ? { ...n, title: newTitle.trim(), content: newContent.trim(), subject: newSubject || null, updated_at: new Date().toISOString() } : n);
    saveNotes(user.id, updatedNotes);
    setNotes(updatedNotes);
    toast.success('Note updated! ✏️');
    setIsEditing(false); setShowViewModal(false); setSelectedNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!user) return;
    const noteToDelete = notes.find(n => n.id === noteId);
    const updatedNotes = notes.filter(n => n.id !== noteId);
    saveNotes(user.id, updatedNotes);
    setNotes(updatedNotes);
    addNotification({ title: 'Note Deleted', message: `"${noteToDelete?.title}" has been deleted.`, type: 'info' });
    toast.success('Note deleted!');
    setShowViewModal(false); setSelectedNote(null);
  };

  const handleTogglePin = (note: Note) => {
    if (!user) return;
    const updatedNotes = notes.map(n => n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n);
    saveNotes(user.id, updatedNotes);
    setNotes(updatedNotes.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)));
    toast.success(note.is_pinned ? 'Note unpinned' : 'Note pinned! 📌');
  };

  const openViewModal = (note: Note) => { setSelectedNote(note); setNewTitle(note.title); setNewSubject(note.subject || ''); setNewContent(note.content || ''); setIsEditing(false); setShowViewModal(true); };
  const openAddModal = () => { setNewTitle(''); setNewSubject(userSubjects[0] || 'General'); setNewContent(''); setShowAddModal(true); };

  return (
    <AppLayout>
      <div className="px-4 py-4 lg:px-8 space-y-6 pb-24 lg:pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">My Notes</h1><p className="text-muted-foreground">{notes.length} note{notes.length !== 1 ? 's' : ''} saved</p></div>
          <MotiButton size="sm" icon={<Plus size={18} />} onClick={openAddModal}>New</MotiButton>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="moti-input pl-12" />
        </motion.div>

        <div className="space-y-3">
          {loading ? (<div className="text-center py-12"><p className="text-muted-foreground">Loading notes...</p></div>) : filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <MotiCard key={note.id} delay={index * 0.05} className="cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><FileText size={22} className="text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">{note.is_pinned && <Pin size={14} className="text-primary" />}<h3 className="font-semibold truncate">{note.title}</h3>{note.subject && (<span className={`px-2 py-0.5 rounded-full text-xs ${getSubjectColor(note.subject)}`}>{note.subject}</span>)}</div>
                    <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><Calendar size={12} />{formatDate(note.updated_at)}</div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleTogglePin(note); }} className="p-2 hover:bg-muted rounded-lg transition-colors">{note.is_pinned ? <PinOff size={16} className="text-primary" /> : <Pin size={16} className="text-muted-foreground" />}</button>
                    <button onClick={() => openViewModal(note)} className="p-2 hover:bg-muted rounded-lg transition-colors"><Eye size={16} className="text-muted-foreground" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 size={16} className="text-destructive" /></button>
                  </div>
                </div>
              </MotiCard>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><FileText size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold mb-2">No notes found</h3><p className="text-sm text-muted-foreground mb-4">{searchQuery ? 'Try a different search term' : 'Create your first note to get started'}</p>{!searchQuery && (<MotiButton size="sm" onClick={openAddModal}><Plus size={16} /> Create Note</MotiButton>)}</motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">New Note</h2><button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter note title" className="moti-input" /></div>
                <div><label className="block text-sm font-medium mb-2">Subject</label><select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="moti-input"><option value="">Select subject</option>{userSubjects.map(subject => (<option key={subject} value={subject}>{subject}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-2">Content</label><textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your note here..." rows={6} className="moti-input resize-none" /></div>
                <MotiButton size="full" onClick={handleAddNote}><Save size={18} /> Save Note</MotiButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewModal && selectedNote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowViewModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">{isEditing ? 'Edit Note' : 'View Note'}</h2><div className="flex items-center gap-2">{!isEditing && (<button onClick={() => setIsEditing(true)} className="p-2 hover:bg-muted rounded-lg"><Edit3 size={20} /></button>)}<button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button></div></div>
              <div className="space-y-4">
                {isEditing ? (<><div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="moti-input" /></div><div><label className="block text-sm font-medium mb-2">Subject</label><select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="moti-input">{userSubjects.map(subject => (<option key={subject} value={subject}>{subject}</option>))}</select></div><div><label className="block text-sm font-medium mb-2">Content</label><textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={6} className="moti-input resize-none" /></div><div className="flex gap-3"><MotiButton size="full" variant="outline" onClick={() => setIsEditing(false)}>Cancel</MotiButton><MotiButton size="full" onClick={handleUpdateNote}><Save size={18} /> Save</MotiButton></div></>) : (<><div>{selectedNote.subject && (<span className={`inline-block px-2 py-0.5 rounded-full text-xs mb-2 ${getSubjectColor(selectedNote.subject)}`}>{selectedNote.subject}</span>)}<h3 className="text-lg font-semibold">{selectedNote.title}</h3><p className="text-xs text-muted-foreground mt-1">{formatDate(selectedNote.updated_at)}</p></div><div className="bg-muted/50 rounded-xl p-4"><p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedNote.content}</p></div><div className="flex gap-3"><MotiButton size="full" variant="outline" onClick={() => handleDeleteNote(selectedNote.id)}><Trash2 size={18} /> Delete</MotiButton><MotiButton size="full" onClick={() => setIsEditing(true)}><Edit3 size={18} /> Edit</MotiButton></div></>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
