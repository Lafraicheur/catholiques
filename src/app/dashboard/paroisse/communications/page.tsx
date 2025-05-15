import React from "react";

const CommunicationsPage: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Communications</h1>
            <p className="mb-6 text-gray-700">
                Here you can manage and view all parish communications.
            </p>
            <div className="bg-white rounded shadow p-4">
                <p className="text-gray-500">No communications to display yet.</p>
            </div>
        </div>
    );
};

export default CommunicationsPage;