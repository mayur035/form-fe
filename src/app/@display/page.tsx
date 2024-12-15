"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function FormData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // to track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/form/get');
        setData(response.data.data); // set the fetched data to state

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // set loading to false after the request is finished
      }
    };

    fetchData();
  }, []);
  return (
    <div className="grid place-content-center p-4">
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-700">No data submitted yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {data && data.length > 0 && data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {item.first_name} {item.last_name}
              </h3>
              <p className="text-gray-600">Email: {item.email}</p>
              <p className="text-gray-600">Phone: {item.phone}</p>
              <p className="text-gray-600">Address: {item.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
