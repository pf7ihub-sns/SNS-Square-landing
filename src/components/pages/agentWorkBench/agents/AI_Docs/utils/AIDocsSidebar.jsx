import { useState } from "react";

function Sidebar({
  documents,
  activeDoc,
  onNewDocument,
  onOpenDocument,
  onRenameDocument,
  onDeleteDocument,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const finishEditing = () => {
    if (editingId && editingTitle.trim() && editingTitle.trim() !== documents.find(d => d.id === editingId)?.title) {
      onRenameDocument(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      finishEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const showDeleteConfirm = (doc) => {
    setDocumentToDelete(doc);
  };

  const hideDeleteConfirm = () => {
    setDocumentToDelete(null);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      onDeleteDocument(documentToDelete.id);
      hideDeleteConfirm();
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col w-64">
      <div className="p-4 border-b py-5 border-gray-700">
        <h2 className="text-xl font-semibold">AI Docs</h2>
      </div>

      <div className="p-4">
        <button
          onClick={onNewDocument}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-1">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No chats yet</p>
              <p className="text-xs text-gray-500 mt-1">Create your first chat to get started</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="group">
                <div className="flex items-center gap-2">
                  {editingId === doc.id ? (
                    // Inline editing mode
                    <div className="flex-1 flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={finishEditing}
                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:border-gray-400 focus:outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    // Normal display mode
                    <button
                      onClick={() => onOpenDocument(doc.id)}
                      className={`flex-1 text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors truncate ${
                        activeDoc === doc.id ? "bg-gray-800 text-white" : "text-gray-300"
                      }`}
                      title={doc.title}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="truncate text-sm">{doc.title}</span>
                      </div>
                    </button>
                  )}
                  
                  <div className={`flex gap-1 transition-opacity ${editingId === doc.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {editingId === doc.id ? (
                      // Edit mode buttons
                      <>
                        <button
                          onClick={finishEditing}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Save changes"
                        >
                          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Cancel editing"
                        >
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      // Normal mode buttons
                      <>
                        <button
                          onClick={() => startEditing(doc.id, doc.title)}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Rename chat"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => showDeleteConfirm(doc)}
                          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                          title="Delete chat"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {documentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Chat
                </h3>
                <p className="text-gray-600 mb-1">
                  Are you sure you want to delete this chat?
                </p>
                <p className="text-sm font-medium text-gray-800 mb-4">
                  &ldquo;{documentToDelete.title}&rdquo;
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={hideDeleteConfirm}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;