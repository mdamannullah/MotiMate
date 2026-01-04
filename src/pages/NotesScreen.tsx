import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Plus, Search, Calendar, Trash2, Eye, X, Edit3, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
  timestamp: number;
}

export default function NotesScreen() {
  const { user } = useAuth();
  const { addNotification } = useData();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');

  // Get user's subjects for dropdown
  const userSubjects = user?.education?.subjects || ['General', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('motimate_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('motimate_notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Biology': 'bg-success/10 text-success',
      'Physics': 'bg-primary/10 text-primary',
      'Mathematics': 'bg-purple-500/10 text-purple-500',
      'Chemistry': 'bg-destructive/10 text-destructive',
      'Computer Science': 'bg-blue-500/10 text-blue-500',
      'English': 'bg-amber-500/10 text-amber-500',
    };
    return colors[subject] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim() || !newSubject) {
      toast.error('Please fill in all fields');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subject: newSubject,
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    
    // Add notification
    addNotification({
      title: 'Note Saved',
      message: `Your note "${newTitle}" has been saved successfully!`,
      type: 'achievement'
    });
    
    toast.success('Note saved successfully! 📝');
    setShowAddModal(false);
    setNewTitle('');
    setNewSubject('');
    setNewContent('');
  };

  const handleUpdateNote = () => {
    if (!selectedNote || !newTitle.trim() || !newContent.trim() || !newSubject) {
      toast.error('Please fill in all fields');
      return;
    }

    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id 
        ? { ...note, title: newTitle.trim(), subject: newSubject, content: newContent.trim() }
        : note
    );
    saveNotes(updatedNotes);
    
    toast.success('Note updated successfully! ✏️');
    setIsEditing(false);
    setShowViewModal(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
    
    addNotification({
      title: 'Note Deleted',
      message: `"${noteToDelete?.title}" has been deleted.`,
      type: 'reminder'
    });
    
    toast.success('Note deleted successfully!');
    setShowViewModal(false);
    setSelectedNote(null);
  };

  const openViewModal = (note: Note) => {
    setSelectedNote(note);
    setNewTitle(note.title);
    setNewSubject(note.subject);
    setNewContent(note.content);
    setIsEditing(false);
    setShowViewModal(true);
  };

  const openAddModal = () => {
    setNewTitle('');
    setNewSubject(userSubjects[0] || 'General');
    setNewContent('');
    setShowAddModal(true);
  };

  return (
    <AppLayout>
      <div className="px-4 py-4 lg:px-8 space-y-6 pb-24 lg:pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">{notes.length} note{notes.length !== 1 ? 's' : ''} saved</p>
          </div>
          <MotiButton size="sm" icon={<Plus size={18} />} onClick={openAddModal}>
            New
          </MotiButton>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="moti-input pl-12"
          />
        </motion.div>

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <MotiCard key={note.id} delay={index * 0.05} className="cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold truncate">{note.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getSubjectColor(note.subject)}`}>
                        {note.subject}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {formatDate(note.timestamp)}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button 
                      onClick={() => openViewModal(note)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Eye size={16} className="text-muted-foreground" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </MotiCard>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No notes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
              </p>
              {!searchQuery && (
                <MotiButton size="sm" onClick={openAddModal}>
                  <Plus size={16} /> Create Note
                </MotiButton>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">New Note</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter note title"
                    className="moti-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="moti-input"
                  >
                    <option value="">Select subject</option>
                    {userSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your note here..."
                    rows={6}
                    className="moti-input resize-none"
                  />
                </div>

                <MotiButton size="full" onClick={handleAddNote}>
                  <Save size={18} /> Save Note
                </MotiButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View/Edit Note Modal */}
      <AnimatePresence>
        {showViewModal && selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{isEditing ? 'Edit Note' : 'View Note'}</h2>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-muted rounded-lg">
                      <Edit3 size={20} />
                    </button>
                  )}
                  <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="moti-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <select
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="moti-input"
                      >
                        {userSubjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={6}
                        className="moti-input resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <MotiButton size="full" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </MotiButton>
                      <MotiButton size="full" onClick={handleUpdateNote}>
                        <Save size={18} /> Save
                      </MotiButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs mb-2 ${getSubjectColor(selectedNote.subject)}`}>
                        {selectedNote.subject}
                      </span>
                      <h3 className="text-lg font-semibold">{selectedNote.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(selectedNote.timestamp)}
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedNote.content}</p>
                    </div>

                    <div className="flex gap-3">
                      <MotiButton size="full" variant="outline" onClick={() => handleDeleteNote(selectedNote.id)}>
                        <Trash2 size={18} /> Delete
                      </MotiButton>
                      <MotiButton size="full" onClick={() => setIsEditing(true)}>
                        <Edit3 size={18} /> Edit
                      </MotiButton>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
