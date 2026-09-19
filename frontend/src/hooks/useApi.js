import { useState } from 'react';
import axios from 'axios';

export default function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/${endpoint}`, { params });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (body = {}) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/${endpoint}`, body);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData, postData };
}
