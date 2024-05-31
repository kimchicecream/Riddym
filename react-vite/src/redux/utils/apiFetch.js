export const apiFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errors = await response.json();
        console.error(`Error fetching ${url}:`, errors);
        return { errors };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Network error fetching ${url}:`, error);
      return { error: error.message };
    }
  };
