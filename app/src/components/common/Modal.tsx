import { X } from "lucide-react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    // INFO: Modal toggles state when clicked on the backdrop but doesnot toggle when clicking inside the modal
    <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={onClose}
    >
      <div 
      className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-xl"
      onClick={(e)=>e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Habit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
