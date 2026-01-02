import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MotiCard } from '@/components/ui/MotiCard';
import { MotiButton } from '@/components/ui/MotiButton';
import { FileText, Plus, Search, Calendar, Trash2, Eye } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}

const demoNotes: Note[] = [
  {
    id: '1',
    title: 'Photosynthesis Process',
    subject: 'Biology',
    content: 'Plants convert sunlight, water, and CO2 into glucose and oxygen...',
    createdAt: 'Today, 2:30 PM',
  },
  {
    id: '2',
    title: "Newton's Laws of Motion",
    subject: 'Physics',
    content: 'First law: An object at rest stays at rest...',
    createdAt: 'Yesterday',
  },
  {
    id: '3',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    content: 'The quadratic formula: x = (-b ± √(b²-4ac))/2a...',
    createdAt: '2 days ago',
  },
];

export default function NotesScreen() {
  const [notes] = useState<Note[]>(demoNotes);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Biology': return 'bg-success/10 text-success';
      case 'Physics': return 'bg-primary/10 text-primary';
      case 'Mathematics': return 'bg-accent-foreground/10 text-accent-foreground';
      case 'Chemistry': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="px-4 py-4 lg:px-8 space-y-6 pb-24 lg:pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">{notes.length} notes saved</p>
          </div>
          <MotiButton size="sm" icon={<Plus size={18} />}>
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{note.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getSubjectColor(note.subject)}`}>
                        {note.subject}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {note.createdAt}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Eye size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg">
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </MotiCard>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notes found</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
