"use client";

import React from "react";

interface Coords {
  lat: number;
  long: number;
}

interface Media {
  url: string;
}

interface RequestOwner {
  avatar: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  id: string;
}

interface ServiceRequest {
  _id: string;
  client: string;
  title: string;
  description: string;
  coords: Coords;
  media: Media[];
  status: string;
  requestOwner: RequestOwner[];
}

interface RequestProps {
  request: ServiceRequest;
}

const Request: React.FC<RequestProps> = ({ request }) => {
  return (
    <div className="grid gap-6">
      <div
        key={request._id}
        className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{request.title}</h2>
        <p className="text-gray-600 mb-4">{request.description}</p>
        
        {request.media.length > 0 && (
          <div className="grid grid-cols-5 gap-4 mb-4">
            {request.media.map((img) => (
              <img
                key={img.url}
                src={img.url}
                alt="Uploaded media"
                className="rounded-lg border border-gray-300 h-80 object-cover"
              />
            ))}
          </div>
        )}
        {request.requestOwner && request.requestOwner.length > 0 && (
          <div className="flex items-center space-x-4 mt-4">
            <img
              src={request.requestOwner[0].avatar}
              alt="Owner Avatar"
              className="h-16 w-16 rounded-full border border-gray-300 object-cover"
            />
            <div>
              <h3 className="text-xl font-medium text-gray-800">
                {request.requestOwner[0].fullname}
              </h3>
              <p className="text-gray-600">@{request.requestOwner[0].username}</p>
              <p className="text-gray-500">Phone: {request.requestOwner[0].phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
