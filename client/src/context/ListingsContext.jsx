import { createContext, useContext, useEffect, useState } from "react";
import { getListings } from "../services/listingService";

const ListingsContext = createContext();

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await getListings();

      if (res.data?.success) {
        setListings(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listings.length === 0) {
      fetchListings();
    }
  }, []);

  return (
    <ListingsContext.Provider
      value={{
        listings,
        loading,
        refreshListings: fetchListings,
        setListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => useContext(ListingsContext);