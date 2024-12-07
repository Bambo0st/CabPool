import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <p className="text-lg text-gray-700">{message}</p>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
