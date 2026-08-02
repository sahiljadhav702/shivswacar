import api from '../../api/axiosConfig';
import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Calendar, Reply } from "lucide-react";
import Modal from "../../components/ui/Modal";

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    api.get(`/enquiries`)
      .then((res) => res.json())
      .then((data) => {
        setEnquiries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch enquiries:", err);
        setLoading(false);
      });
  }, []);

  const openReplyModal = (enq) => {
    setSelectedEnquiry(enq);
    setReplyMessage("");
    setIsReplyModalOpen(true);
  };

  const handleSendReply = () => {
    // Mock sending reply
    setEnquiries(enquiries.map(e => 
      e.id === selectedEnquiry.id ? { ...e, status: "Resolved" } : e
    ));
    setIsReplyModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Enquiries</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and respond to customer questions and messages.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading enquiries...</p>
        ) : enquiries.length === 0 ? (
          <p className="text-slate-500">No enquiries found.</p>
        ) : (
          enquiries.map((enq) => (
            <div key={enq.id} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{enq.subject}</h3>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{enq.name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {enq.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {enq.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {enq.date}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${enq.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {enq.status}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-700/50">
                "{enq.message}"
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => openReplyModal(enq)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  <Reply className="w-4 h-4" /> Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      <Modal isOpen={isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)} title="Reply to Enquiry">
        {selectedEnquiry && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-sm font-medium text-slate-900 dark:text-white">To: {selectedEnquiry.name} ({selectedEnquiry.email})</p>
              <p className="text-sm text-slate-500 mt-1">Re: {selectedEnquiry.subject}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Your Message</label>
              <textarea 
                rows={5}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button onClick={() => setIsReplyModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
              <button 
                onClick={handleSendReply}
                disabled={!replyMessage.trim()} 
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Reply className="w-4 h-4" /> Send Reply
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
