"use client";

import { useState } from "react";
import { useUserData } from "@/contexts/user-data-context";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2, StickyNote } from "lucide-react";

interface StockNotesProps {
  ticker: string;
}

export function StockNotes({ ticker }: StockNotesProps) {
  const { getNote, setNote, deleteNote } = useUserData();
  const currentNote = getNote(ticker);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(currentNote);

  const handleEdit = () => {
    setDraft(currentNote);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      setNote(ticker, trimmed);
    } else {
      deleteNote(ticker);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(ticker);
    setDraft("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add your notes about this stock..."
          className="min-h-[120px] text-sm"
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="flex-1">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          {currentNote && (
            <Button size="sm" variant="outline" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (currentNote) {
    return (
      <div
        className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors group"
        onClick={handleEdit}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{currentNote}</p>
          <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleEdit}
      className="w-full p-4 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
    >
      <StickyNote className="h-5 w-5 mx-auto mb-1.5 opacity-50" />
      Click to add notes
    </button>
  );
}
